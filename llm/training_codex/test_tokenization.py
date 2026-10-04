"""Local MLX/tokenizer checks; no model weights loaded, no network."""
import os
os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
from pathlib import Path
import json,unittest
import mlx.core as mx
from transformers import AutoTokenizer
from run_mlx import CompletionDataset,select_eval
from completion_loss import completion_mask
from mlx_lm.tuner.trainer import default_loss
PROJECT=Path(__file__).resolve().parents[2]
DATA=PROJECT/'llm/sft_runs/20261004_family_v03'
def load(p):return [json.loads(s) for s in p.read_text().splitlines()]
class Tests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.rows=load(DATA/'train.jsonl');cls.dev=load(DATA/'dev.jsonl');cls.ann=load(DATA/'dev.annotations.jsonl')
  cls.tokenizer=AutoTokenizer.from_pretrained(PROJECT/'llm/base_models/qwen3_06b_official_20261004/mlx_int4',local_files_only=True,trust_remote_code=False)
  cls.ds=CompletionDataset(cls.rows,cls.tokenizer)
 def test_every_completion_decodes_exactly(self):
  for row,(tokens,offset) in zip(self.rows,self.ds.records):self.assertEqual(self.tokenizer.decode(tokens[offset:-1]),row['messages'][-1]['content'])
 def test_prompt_matches_generation(self):
  for i in [0,1,20,2999]:
   prompt=self.tokenizer.apply_chat_template(self.rows[i]['messages'][:-1],tokenize=False,add_generation_prompt=True,enable_thinking=False)
   tokens,offset=self.ds.records[i];self.assertEqual(tokens[:offset],self.tokenizer.encode(prompt,add_special_tokens=False))
 def test_nonempty_supervision_and_eos(self):
  for tokens,offset in self.ds.records:self.assertGreater(len(tokens),offset+1);self.assertEqual(tokens[-1],self.tokenizer.eos_token_id)
 def test_no_planned_truncation(self):self.assertLessEqual(max(self.ds.lengths),576)
 def test_eval_subset_frozen_and_deterministic(self):
  a=select_eval(self.dev,self.ann,48,7070);b=select_eval(self.dev,self.ann,48,7070);self.assertEqual(a,b);self.assertEqual(len({r['id'] for r in a}),48)
 def test_selected_eval_has_all_terms_and_statuses(self):
  a=select_eval(self.dev,self.ann,48,7070);its=[i for r in a for i in r['target']['items']]
  self.assertEqual(len({i['term'] for i in its}),10);self.assertEqual(len({i['status'] for i in its}),4);self.assertEqual({r['language'] for r in a},{'en','sw','mixed'})
 def test_padding_mask_at_boundaries(self):
  mask=completion_mask(mx.array([[2,6],[4,5]]),8).tolist()
  self.assertEqual(mask[0],[False,True,True,True,True,False,False,False]);self.assertEqual(mask[1],[False,False,False,True,False,False,False,False])
 def test_upstream_includes_first_padding_token(self):
  class Dummy:
   def __call__(self,x):return mx.zeros((*x.shape,4))
  _,count=default_loss(Dummy(),mx.zeros((1,9),dtype=mx.int32),mx.array([[2,6]]))
  # Reproduces installed 0.31.2's inclusive end boundary; v02 corrects this.
  self.assertEqual(count.item(),5);self.assertEqual(completion_mask(mx.array([[2,6]]),8).sum().item(),4)
if __name__=='__main__':unittest.main(verbosity=2)
