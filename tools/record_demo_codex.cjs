/* Records real fictional-case interactions in the local app. No app UI modifications. */
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
let pw; try { pw = require('playwright'); } catch { pw = require(process.env.AFYANOTE_PLAYWRIGHT || '/Users/peter/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const root = path.resolve(__dirname, '..'), base = process.env.AFYANOTE_TEST_URL || 'http://localhost:8000/';
const version = fs.readFileSync(path.join(root, 'app/sw.js'), 'utf8').match(/const VERSION = "([^"]+)"/)[1];
const destination = path.join(root, 'docs/05_pitch/assets', process.env.AFYANOTE_MEDIA_FOLDER || ('codex_' + version.replace('afyanote-','').replaceAll('.','')));
if (fs.existsSync(destination) && fs.readdirSync(destination).length) throw Error('Media destination already contains files; select a new AFYANOTE_MEDIA_FOLDER.');
fs.mkdirSync(destination, { recursive: true });
const walkFiles = (dir,prefix='') => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walkFiles(path.join(dir,e.name),prefix+e.name+'/'):[prefix+e.name]).sort();
const sourceFiles = walkFiles(path.join(root,'app'));
const snapshot = () => Object.fromEntries(sourceFiles.map(name => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'app', name))).digest('hex')]));
const before = snapshot(), timeline = [], requests = [], errors = []; let browser;
const note = 'Mtoto ana homa kwa siku mbili. Pia anakohoa. Hana kuhara. Ana miaka 3.';
const screenshot = async (page, file) => { await page.evaluate(() => window.scrollTo(0,0)); await page.screenshot({path:path.join(destination,file)}); };
function observe(context) { context.on('request', r => requests.push({method:r.method(),url:r.url(),body:r.postData()})); context.on('page', p=>{p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());}); }
async function confirm(page, hold) {
  const labels = await page.locator('[data-ok]').evaluateAll(elements => elements.map(e=>e.dataset.ok));
  for (const label of labels) { await page.locator(`[data-ok="${label}"]`).click(); await hold(3); }
  if (await page.locator('#ageOk').count()) {await page.locator('#ageOk').click();await hold(3);}
}
(async () => {
  const executablePath = process.env.AFYANOTE_BROWSER_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
  browser = await pw.chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
  const context = await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true,recordVideo:{dir:destination,size:{width:390,height:844}}}); observe(context);
  const page = await context.newPage(), started = Date.now(), video = page.video();
  const mark = name => timeline.push({at_seconds:+((Date.now()-started)/1000).toFixed(2),event:name});
  const hold = async seconds => page.waitForTimeout(seconds*1000);
  await page.goto(base);await page.waitForFunction(()=>document.querySelector('#offlinePill').textContent.includes('Ready offline'));mark('Offline package ready in desktop Chrome');await hold(3);
  await context.setOffline(true);await page.reload();await page.waitForFunction(()=>document.querySelector('#offlinePill').textContent.includes('package ready'));mark('Actual browser network simulation: offline reload');await hold(3);
  await page.locator('#note').pressSequentially(note,{delay:60});await screenshot(page,'01_note_mobile.png');mark('Fictional Swahili note entered, English interface');await hold(4);
  await page.locator('#goAnalyse').click();assert.equal(await page.locator('#next').isDisabled(),true);await screenshot(page,'02_review_mobile.png');mark('Original evidence, review required before continuing');await hold(5);
  await confirm(page,hold);await page.evaluate(()=>window.scrollTo(0,0));mark('Each term and age manually confirmed in this demonstration');await hold(3);
  await page.locator('#next').click();await page.locator('#f_caseId').pressSequentially('DEMO-CODEX-VIDEO',{delay:80});await hold(3);
  await page.locator('#consent').check();mark('Fictional case identifier and simulated consent');await hold(4);
  await page.locator('#next').click();await screenshot(page,'03_handover_mobile.png');mark('Reviewed draft; unrecorded fields remain open');await hold(6);
  const downloadPromise=page.waitForEvent('download');await page.locator('#mdBtn').click();await(await downloadPromise).saveAs(path.join(destination,'fictional-video-draft.md'));mark('Local Markdown export');await hold(3);
  await page.locator('#qrBtn').click();await screenshot(page,'04_qr_mobile.png');mark('Local QR generated, no real camera compatibility test');await hold(5);await page.keyboard.press('Escape');
  await page.locator('#newCase').click();assert.equal(await page.locator('#note').inputValue(),'');mark('New case clears in-app source and decisions');await hold(3);
  await page.locator('[data-ex="3"]').click();await page.locator('#goAnalyse').click();assert.equal(await page.locator('[data-ok="fever"]').isDisabled(),true);await screenshot(page,'05_conflict_mobile.png');mark('Contradictory fictional source needs an explicit human choice');await hold(6);
  await page.locator('input[data-as="fever"][value="denied"]').locator('..').click();await hold(4);mark('Demonstration ended; no clinical decision or physical-phone test');
  await context.close();const originalVideo=await video.path();await video.saveAs(path.join(destination,'demo_mobile.webm'));
  if(path.dirname(path.resolve(originalVideo))===destination && path.basename(originalVideo)!=='demo_mobile.webm') fs.unlinkSync(originalVideo);
  const desktopContext=await browser.newContext({viewport:{width:1280,height:900}});observe(desktopContext);const desktop=await desktopContext.newPage();await desktop.goto(base);await desktop.waitForFunction(()=>document.querySelector('#offlinePill').textContent.includes('Ready offline'));
  await desktop.locator('#note').fill(note);await screenshot(desktop,'06_note_desktop.png');await desktop.locator('#goAnalyse').click();await screenshot(desktop,'07_review_desktop.png');await confirm(desktop,async()=>{});await desktop.locator('#next').click();await desktop.locator('#f_caseId').fill('DEMO-CODEX-VIDEO');await desktop.locator('#consent').check();await desktop.locator('#next').click();await screenshot(desktop,'08_handover_desktop.png');await desktopContext.close();
  const after=snapshot();assert.deepEqual(after,before);assert.equal(errors.length,0);assert.ok(requests.every(r=>r.method==='GET'&&r.body===null&&new URL(r.url).origin===new URL(base).origin));
  fs.writeFileSync(path.join(destination,'capture_manifest.json'),JSON.stringify({created_at:new Date().toISOString(),version,browser:await browser.version(),viewport:{width:390,height:844},fictional:true,physical_phone:false,native_swahili_review:false,network_loss:'Playwright context.setOffline(true), followed by actual page reload',voiceover:false,source_before:before,source_after:after,timeline,pageErrors:errors,external_requests:0,note_uploads:0},null,2));
  await browser.close();console.log(JSON.stringify({status:'captured',version,folder:destination,events:timeline.length}));
})().catch(async e=>{console.error(e);if(browser)await browser.close();process.exit(1)});
