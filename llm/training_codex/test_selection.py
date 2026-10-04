"""ChatGPT/Codex: source binding/decoder contract; no model dependencies."""
import unittest,json
from selection import clauses,user_content,resolve_selection
class Tests(unittest.TestCase):
 def item(self,**kwargs):return {'term':'fever','status':'stated','clause_id':'c0','duration_days':None,**kwargs}
 def test_offsets(self):
  note='  Child: fever;  Mother: cough. Farm visit '
  for c in clauses(note):self.assertEqual(note[c['start']:c['end']],c['text'])
 def test_decimal_not_split(self):self.assertEqual(len(clauses('Child age 3.5 years; fever')),2)
 def test_no_text_created(self):self.assertEqual(resolve_selection({'items':[self.item()]},'Child: fever')['items'][0]['evidence'],'Child: fever')
 def test_source_choice_preserved(self):self.assertEqual(resolve_selection({'items':[self.item(clause_id='c1')]},'Child: fever; Mother: cough')['items'][0]['evidence'],'Mother: cough')
 def test_unknown_source_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[self.item(clause_id='c9')]},'Child: fever')
 def test_extra_fields_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[self.item(evidence='invented')]},'Child: fever')
 def test_duplicate_terms_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[self.item(),self.item()]},'Child: fever')
 def test_extra_root_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[],'diagnosis':'x'},'Farm')
 def test_boolean_duration_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[self.item(duration_days=True)]},'Child: fever')
 def test_unknown_term_rejected(self):
  with self.assertRaises(ValueError):resolve_selection({'items':[self.item(term='malaria')]},'Child: fever')
 def test_empty_output(self):self.assertEqual(resolve_selection('{"items":[]}','Farm visit'),{'items':[]})
 def test_max_source_passages(self):
  with self.assertRaises(ValueError):clauses('; '.join(['x']*33))
 def test_wrong_semantic_choice_still_possible(self):
  # Literal source binding cannot establish semantic truth: deliberately retained.
  out=resolve_selection({'items':[self.item()]},'Mother: cough');self.assertEqual(out['items'][0]['term'],'fever')
if __name__=='__main__':unittest.main(verbosity=2)
