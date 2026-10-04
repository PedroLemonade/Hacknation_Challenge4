// ChatGPT / Codex: real CLI report-contract checks with temporary synthetic fixtures.
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const here=dirname(fileURLToPath(import.meta.url)),temp=mkdtempSync(join(tmpdir(),'afya-report-contract-'));
const tests=[],sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const run=(input,report,...args)=>spawnSync(process.execPath,[join(here,'eval_llm.mjs'),'--input-dir',input,'--report-dir',report,...args],{encoding:'utf8'});
const check=(name,fn)=>{try{fn();tests.push({name,pass:true});}catch(e){tests.push({name,pass:false,error:e.message});}};
try{
  const input=join(temp,'reference'),report=join(temp,'report');
  check('Fresh reference selftest produces a complete report',()=>{const r=run(input,report,'--selftest');assert.equal(r.status,0,r.stderr);const j=JSON.parse(readFileSync(join(report,'results.json')));assert.equal(j.selftest.passed,true);assert.ok(j.rows.every(x=>x.complete&&x.expected_notes===40));});
  check('Existing report refuses overwrite',()=>{const p=join(report,'results.json'),h=sha(p);const r=run(input,report);assert.notEqual(r.status,0);assert.match(r.stderr,/Report exists/);assert.equal(sha(p),h);});
  const original=readFileSync(join(input,'selftest_classifier__independent.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
  let n=0;
  const fixture=(rows,meta)=>{const folder=join(temp,'f'+(++n));mkdirSync(folder);writeFileSync(join(folder,'answers.jsonl'),rows.map(x=>JSON.stringify(x)).join('\n')+'\n');if(meta)writeFileSync(join(folder,'answers.meta.json'),JSON.stringify(meta));return folder;};
  const rejected=(rows,meta,pattern)=>{const r=run(fixture(rows,meta),join(temp,'r'+n));assert.notEqual(r.status,0);assert.match(r.stderr,pattern);};
  check('Duplicate IDs cannot inflate a CLI report',()=>rejected([original[0],original[0]],null,/duplicate_answer_id/));
  check('Unknown IDs cannot silently disappear',()=>rejected([{...original[0],id:'unknown'}],null,/unknown_answer_id/));
  check('Changed dataset hash aborts',()=>rejected([original[0]],{dataset_sha256:'bad'},/Dataset hash changed/));
  check('Changed capture hash aborts',()=>rejected([original[0]],{answer_sha256:'bad'},/Raw answers changed/));
  check('Mixed dataset rows abort',()=>rejected([original[0],{...original[1],set:'notes'}],null,/Mixed models\/sets/));
  check('One-answer smoke run retains 40-note denominator',()=>{const f=fixture([original[0]]),r=join(temp,'partial');const x=run(f,r);assert.equal(x.status,0,x.stderr);const j=JSON.parse(readFileSync(join(r,'results.json'))).rows[0];assert.equal(j.missing_notes,39);assert.equal(j.gold_terms,63);assert.equal(j.complete,false);});
}finally{rmSync(temp,{recursive:true,force:true});}
const result={created_by:'ChatGPT / Codex',created_at:new Date().toISOString(),source_sha256:sha(join(here,'eval_llm.mjs')),passed:tests.filter(t=>t.pass).length,total:tests.length,tests};
const i=process.argv.indexOf('--report');if(i>=0)writeFileSync(process.argv[i+1],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(result.passed!==result.total)process.exitCode=1;
