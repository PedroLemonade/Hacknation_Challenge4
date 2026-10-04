"""ChatGPT/Codex: split, immutability, annotation-policy and deterministic tests."""
import importlib.util,json,sys,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('export',Path(__file__).parent.parent/'export_sft.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
class Tests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.generated=e.build(7070,600,120)[0]
 def test_note_overlap(self):
  sets=[{e.canonical(r['messages'][1]['content']) for r in self.generated[s][0]} for s in ('train','dev')]
  self.assertFalse(sets[0]&sets[1]);self.assertEqual([len(s) for s in sets],[600,120])
 def test_family_overlap(self):
  sets=[{f for m in self.generated[s][1] for f in m['families']} for s in ('train','dev')];self.assertFalse(sets[0]&sets[1])
 def test_determinism(self):self.assertEqual(self.generated,e.build(7070,600,120)[0])
 def test_seed_effect(self):self.assertNotEqual(self.generated,e.build(7071,600,120)[0])
 def test_duplicate_terms_and_exact_quotes(self):
  for split in self.generated.values():
   for row in split[0]:
    note=row['messages'][1]['content'];items=json.loads(row['messages'][-1]['content'])['items'];self.assertEqual(len(items),len({i['term'] for i in items}))
    for i in items:self.assertIn(i['evidence'],note)
 def test_exclusions(self):
  pools,_,_,_=e.pools()
  for split in pools.values():
   for key,values in split.items():
    for phrase in values:self.assertNotIn(phrase,e.EXCLUDE.get(key.split('/')[1],{}))
 def test_inability_and_weakness_positive(self):
  p,_,_,_=e.pools();self.assertIn('hawezi kunywa',p['train']['sw/ds_cannot_drink/stated']);self.assertIn('hana nguvu',p['train']['sw/weakness/stated'])
 def test_singletons_explicit(self):self.assertTrue(e.pools()[2])
 def test_no_unsupported_denied_ability(self):self.assertNotIn('en/ds_cannot_drink/denied',e.pools()[0]['train'])
 def test_nonstated_duration_null(self):
  for rows,_ in self.generated.values():
   for r in rows:
    for i in json.loads(r['messages'][-1]['content'])['items']:
     if i['status']!='stated':self.assertIsNone(i['duration_days'])
 def test_collision_refuses(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'run';e.export(p,7070,20,10);before=(p/'train.jsonl').read_bytes()
   with self.assertRaises(FileExistsError):e.export(p,1,20,10)
   self.assertEqual(before,(p/'train.jsonl').read_bytes())
 def test_mlx_valid_alias(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'run';e.export(p,7070,20,10);self.assertEqual((p/'dev.jsonl').read_bytes(),(p/'valid.jsonl').read_bytes())
if __name__=='__main__':unittest.main(verbosity=2)
