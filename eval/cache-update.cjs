/* ChatGPT / Codex: isolated complete app copies; exercise SW upgrade with live cases.
   The A/B/C builds are instrumented test fixtures, not released product versions. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),http=require('node:http'),assert=require('node:assert/strict');
let pw;try{pw=require('playwright')}catch{pw=require(process.env.AFYANOTE_PLAYWRIGHT||'/Users/peter/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}
const root=path.resolve(__dirname,'..'),walk=(d,p='')=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name),p+e.name+'/'):[p+e.name]).sort();
const sourceFiles=walk(path.join(root,'app')),digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const snapshot=()=>Object.fromEntries(sourceFiles.map(n=>[n,digest(fs.readFileSync(path.join(root,'app',n)))]));
const before=snapshot(),source=Object.fromEntries(sourceFiles.map(n=>[n,fs.readFileSync(path.join(root,'app',n))]));
const fixture=label=>Object.fromEntries(Object.entries(source).map(([n,b])=>[n,n==='sw.js'?Buffer.from(b.toString().replace(/const VERSION = "[^"]+"/,`const VERSION = "afyanote-v0.4.17-lab-${label.toLowerCase()}"`)):n==='app.js'?Buffer.concat([b,Buffer.from(`\nglobalThis.AFYANOTE_LAB_ASSET="${label}";\n`)]):b]));
const fixtures={A:fixture('A'),B:fixture('B'),C:fixture('C')};let served='A',browser,server;
const output=path.resolve(root,process.env.AFYANOTE_CACHE_REPORT_DIR||'eval/cache_update_runs/'+new Date().toISOString().replace(/[:.]/g,'-'));
if(!output.startsWith(path.join(root,'eval/cache_update_runs')+path.sep)||fs.existsSync(output))throw Error('Select a fresh directory under eval/cache_update_runs');
fs.mkdirSync(output,{recursive:true});const checks=[],events=[],errors=[];const pass=name=>checks.push({name,status:'passed'});
async function ready(page){await page.waitForFunction(()=>document.querySelector('#offlinePill').textContent.includes('Ready offline'))}
async function swVersion(page){return page.evaluate(()=>new Promise(resolve=>{const c=new MessageChannel();const t=setTimeout(()=>resolve({ready:false,error:'message_timeout'}),5000);c.port1.onmessage=e=>{clearTimeout(t);c.port1.close();resolve(e.data)};navigator.serviceWorker.controller.postMessage('CHECK_READY',[c.port2])}))}
async function waitVersion(page,label){await page.waitForFunction(async expected=>{if(!navigator.serviceWorker.controller)return false;return await new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>{c.port1.close();resolve(e.data.version.endsWith(expected))};navigator.serviceWorker.controller.postMessage('CHECK_READY',[c.port2])})},label.toLowerCase());}
async function upgrade(page,label){served=label;await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update()});await waitVersion(page,label);}
(async()=>{
 server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(served==='C'&&name==='model.json'){res.writeHead(503);return res.end('Intentional incomplete test fixture')}
  const body=fixtures[served][name];if(!body){res.writeHead(404);return res.end()}
  res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.json')?'application/json':name.endsWith('.png')?'image/png':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.webmanifest')?'application/manifest+json':'text/html','Cache-Control':'no-store'});res.end(body);
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url='http://127.0.0.1:'+server.address().port+'/';
 const executablePath=process.env.AFYANOTE_BROWSER_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';browser=await pw.chromium.launch({headless:true,executablePath});
 const context=await browser.newContext();context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept())});
 const one=await context.newPage(),two=await context.newPage();await one.goto(url);await ready(one);await two.goto(url);await ready(two);
 const note='Child has cough without fever.';await one.locator('#note').fill(note);await one.locator('#goAnalyse').click();await one.locator('[data-ok="cough"]').click();await one.locator('[data-ok="fever"]').click();assert.equal(await one.locator('#next').isDisabled(),false);
 const second='Mother has fever.';await two.locator('#note').fill(second);assert.equal(await one.evaluate(()=>globalThis.AFYANOTE_LAB_ASSET),'A');
 pass('Two live A documents have independent fictional cases; first review complete');
 await upgrade(one,'B');await waitVersion(two,'B');await ready(one);await ready(two);assert.equal((await swVersion(two)).version,'afyanote-v0.4.17-lab-b');
 assert.equal(await one.locator('#note').inputValue(),note);assert.equal(await two.locator('#note').inputValue(),second);assert.equal(await one.locator('#next').isDisabled(),false);assert.equal(await one.evaluate(()=>globalThis.AFYANOTE_LAB_ASSET),'A');
 pass('B claims both clients without reload or losing source/review decisions');
 const names=await one.evaluate(()=>caches.keys());assert.ok(names.some(n=>n.startsWith('afyanote-v0.4.17-lab-b:')));assert.equal(names.some(n=>n.startsWith('afyanote-v0.4.17-lab-a:')),false);
 pass('Activated B cache replaces A only within this isolated registration scope');
 await context.setOffline(true);const fresh=await context.newPage();await fresh.goto(url);await fresh.waitForFunction(()=>document.querySelector('#offlinePill').textContent.includes('package ready'));assert.equal(await fresh.evaluate(()=>globalThis.AFYANOTE_LAB_ASSET),'B');assert.equal(await fresh.locator('#note').inputValue(),'');assert.equal(await one.locator('#note').inputValue(),note);
 pass('Offline new tab loads B assets with empty case; old A document keeps its open case');
 await fresh.locator('#note').fill(note);await fresh.locator('#goAnalyse').click();assert.equal(await fresh.locator('input[data-as="cough"][value="stated"]').isChecked(),true);assert.equal(await fresh.locator('input[data-as="fever"][value="denied"]').isChecked(),true);
 pass('Current scoped negation runs from the newly activated offline B cache');
 await context.setOffline(false);served='C';await one.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();window.AFYANOTE_C_INSTALL_STATE='not_started';r.addEventListener('updatefound',()=>{const w=r.installing;w.addEventListener('statechange',()=>window.AFYANOTE_C_INSTALL_STATE=w.state)});await r.update()});await one.waitForFunction(()=>window.AFYANOTE_C_INSTALL_STATE==='redundant');
 assert.equal((await swVersion(one)).version,'afyanote-v0.4.17-lab-b');assert.equal((await swVersion(one)).ready,true);assert.equal(await one.locator('#note').inputValue(),note);
 pass('Incomplete C installation is rejected; active complete B and live case survive');
 await one.evaluate(async()=>{const key=(await caches.keys()).find(n=>n.startsWith('afyanote-v0.4.17-lab-b:'));const c=await caches.open(key);await c.delete(new URL('model.json',location.href).href);navigator.serviceWorker.dispatchEvent(new Event('controllerchange'))});await one.waitForFunction(()=>!document.querySelector('#retryResources').hidden);assert.equal((await swVersion(one)).ready,false);assert.equal(await one.locator('#note').inputValue(),note);
 pass('Missing cached model removes ready-offline claim while retaining the open source');
 served='B';const repaired=await one.evaluate(()=>new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>{c.port1.close();resolve(e.data)};navigator.serviceWorker.controller.postMessage('REPAIR_CACHE',[c.port2])}));assert.equal(repaired.ready,true);await one.evaluate(()=>navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));await ready(one);assert.equal(await one.locator('#note').inputValue(),note);assert.equal(await one.locator('#next').isDisabled(),false);
 pass('Explicit SW repair restores complete B cache without resetting the old document review');
 assert.equal(errors.length,0);assert.deepEqual(snapshot(),before);pass('Active project app unchanged; no page-script errors');
 await browser.close();browser=null;server.close();
 const result={created_at:new Date().toISOString(),created_by:'ChatGPT / Codex',status:'passed',checks,source_before:before,source_after:snapshot(),fixture_hashes:Object.fromEntries(Object.entries(fixtures).map(([label,files])=>[label,Object.fromEntries(Object.entries(files).map(([n,b])=>[n,digest(b)]))])),page_errors:errors,physical_phone:false,caveats:['Instrumented A/B/C test builds derived from v0.4.17, not released versions.','Existing document JS stays A until deliberate reload; new tabs load B.','This tests SW activation/cache mechanics, not arbitrary semantic compatibility between future changed models, schemas or rules.','Case data remains memory-only; no OS restart, native background transition or phone tested.']};
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'passed',checks:checks.length,output}));
})().catch(async e=>{checks.push({name:e.message,status:'failed'});fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({created_at:new Date().toISOString(),created_by:'ChatGPT / Codex',status:'failed',checks,source_before:before,source_after:snapshot(),error:e.stack,page_errors:errors},null,2));if(browser)await browser.close();if(server)server.close();console.error(e);process.exitCode=1});
