"""ChatGPT / Codex: old partial snapshots cannot be called current."""
import unittest
from current_evidence import matches_sources

class EvidenceContracts(unittest.TestCase):
    def test_complete_before_and_after(self):
        h={'a':'1','b':'2'}
        self.assertTrue(matches_sources({'source_before':h,'source_after':h},h))
    def test_partial_snapshot_rejected(self):
        self.assertFalse(matches_sources({'source_before':{'a':'1'},'source_after':{'a':'1'}},{'a':'1','b':'2'}))
    def test_changed_file_rejected(self):
        self.assertFalse(matches_sources({'source_before':{'a':'1'},'source_after':{'a':'2'}},{'a':'2'}))
    def test_empty_snapshot_rejected(self):
        self.assertFalse(matches_sources({'source_before':{},'source_after':{}},{}))

if __name__=='__main__': unittest.main(verbosity=2)
