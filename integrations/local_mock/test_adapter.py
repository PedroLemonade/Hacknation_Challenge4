"""ChatGPT / Codex: evidence, human review, source and immutable transport contracts."""
import copy,json,tempfile,unittest
from pathlib import Path
from adapter import build_mock,validate,load,InvalidDraft
ROOT=Path(__file__).resolve().parents[2]
class Contracts(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.fixture=json.loads((ROOT/'eval/browser_runs/20261004_final_v0417/artifacts/fictional-scope-draft.json').read_text())
 def mutate(self,fn):d=copy.deepcopy(self.fixture);fn(d);return d
 def rejected(self,fn):self.assertRaises((InvalidDraft,ValueError),validate,self.mutate(fn))
 def test_valid_open_fields(self):self.assertIsNone(build_mock(self.fixture)['source_draft']['age'])
 def test_idempotence(self):self.assertEqual(build_mock(self.fixture)['record_key'],build_mock(dict(reversed(list(self.fixture.items()))))['record_key'])
 def test_consent(self):self.rejected(lambda d:d.update(consent_recorded=False))
 def test_pending(self):self.rejected(lambda d:d['review_log'][0].update(decision='pending'))
 def test_extra_root(self):self.rejected(lambda d:d.update(backend_url='https://example.org'))
 def test_wrong_schema(self):self.rejected(lambda d:d.update(schema='official.referral'))
 def test_span(self):self.rejected(lambda d:d['review_log'][0]['evidence'][0].update(start=1))
 def test_age_unit(self):self.rejected(lambda d:d.update(age={'value':3,'unit':'days'}))
 def test_non_fictional(self):self.rejected(lambda d:d.update(demo_data_fictional=False))
 def test_group_polarity(self):self.rejected(lambda d:d['main_problems'][0].update(status='denied'))
 def test_denied_duration(self):self.rejected(lambda d:d['documented_absent'][0].update(duration_days=2,duration_source='note'))
 def test_duplicate_term(self):self.rejected(lambda d:d['main_problems'].append(copy.deepcopy(d['main_problems'][0])))
 def test_edit_audit(self):self.rejected(lambda d:d['review_log'][0].update(original_rule_status='past',edited_by_user=False))
 def test_duplicate_json_keys(self):
  with tempfile.TemporaryDirectory() as t:
   p=Path(t)/'draft.json';p.write_text('{"schema":1,"schema":2}');self.assertRaises(InvalidDraft,load,p)
 def test_real_unicode(self):
  p=ROOT/'eval/deep_runs/20261004_final_v0417';files=list(p.glob('draft-*.json'));d=next(json.loads(f.read_text()) for f in files if '😀' in json.loads(f.read_text())['original_note']);self.assertTrue(build_mock(d)['mock'])
 def test_real_resolved_other_person(self):
  d=json.loads((ROOT/'eval/browser_runs/20261004_final_v0417/artifacts/fictional-context-draft.json').read_text());out=build_mock(d)
  self.assertTrue(any(x['status']=='other_person' for x in out['source_draft']['mentioned_other_person_or_past']))
 def test_past_keeps_audit_and_no_duration(self):
  d=copy.deepcopy(self.fixture);item=d['main_problems'].pop();item.update(status='past',duration_days=None,duration_source=None,edited_by_user=True)
  d['mentioned_other_person_or_past'].append(item)
  log=next(x for x in d['review_log'] if x['label']==item['label']);log.update(selected_status='past',edited_by_user=True)
  self.assertEqual(build_mock(d)['source_draft']['mentioned_other_person_or_past'][0]['status'],'past')
 def test_rejected_suggestion_stays_only_in_audit(self):
  d=copy.deepcopy(self.fixture);item=d['main_problems'].pop();log=next(x for x in d['review_log'] if x['label']==item['label']);log.update(decision='rejected',selected_status=None)
  out=build_mock(d);self.assertEqual(out['source_draft']['main_problems'],[]);self.assertEqual(out['source_draft']['review_log'],d['review_log'])
 def test_unresolved_conflict_rejected(self):self.rejected(lambda d:d['review_log'][0].update(original_rule_status='conflict',selected_status=None))
 def test_non_finite_json_rejected(self):
  with tempfile.TemporaryDirectory() as t:
   p=Path(t)/'draft.json';p.write_text('{"value":NaN}');self.assertRaises(InvalidDraft,load,p)
 def test_source_immutable(self):d=copy.deepcopy(self.fixture);out=build_mock(d);out['source_draft']['original_note']='changed';self.assertEqual(d,self.fixture)
if __name__=='__main__':unittest.main(verbosity=2)
