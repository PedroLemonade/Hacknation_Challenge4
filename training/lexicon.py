"""
AfyaNote synthetic lexicon.

All phrases are written for a fictional demo. They were NOT reviewed by a
native Swahili speaker or a clinician. Every generated row is marked synthetic.

Each label has three phrase pools:
  train    phrasings used to build training and dev data (and the dictionary baseline)
  heldout  phrasings that never appear in training (morphology, spelling, paraphrase)
  negated  phrasings that deny the term
For symptom terms a negated phrase still counts as a MENTION (the model finds the
passage, the rules decide "denied"). For danger sign terms a negated phrase is a
hard negative (label 0), because "can drink well" must not be proposed at all.
"""

LABELS = [
    "fever", "cough", "diarrhoea", "vomiting", "pain", "weakness",
    "ds_cannot_drink", "ds_vomits_everything", "ds_convulsions", "ds_lethargic",
]

DANGER = {"ds_cannot_drink", "ds_vomits_everything", "ds_convulsions", "ds_lethargic"}

LEX = {
    "fever": {
        "train": {"sw": ["ana homa", "homa kali", "mwili una joto", "joto jingi mwilini", "anaugua homa", "homa"],
                  "en": ["fever", "high fever", "has fever", "hot body"]},
        "heldout": {"sw": ["homma", "mwili wake una joto jingi", "joto kali la mwili", "ana homa za usiku"],
                    "en": ["has a fever", "feverish", "temperature iko juu", "body is very hot"]},
        "negated": {"sw": ["hana homa", "hakuna homa", "bila homa"],
                    "en": ["no fever", "does not have fever"]},
    },
    "cough": {
        "train": {"sw": ["anakohoa", "ana kikohozi", "kikohozi kikali", "kukohoa sana", "kikohozi"],
                  "en": ["cough", "coughing", "bad cough"]},
        "heldout": {"sw": ["alikohoa usiku", "kikohozi kavu", "anakohowa", "kikohozi cha usiku"],
                    "en": ["has a bad cough", "coughs at night", "dry cough"]},
        "negated": {"sw": ["hakohoi", "hana kikohozi"],
                    "en": ["no cough", "not coughing"]},
    },
    "diarrhoea": {
        "train": {"sw": ["anaharisha", "kuhara", "choo cha maji", "anaendesha", "kuharisha"],
                  "en": ["diarrhoea", "diarrhea", "running stomach"]},
        "heldout": {"sw": ["ameharisha", "kuharisha sana", "anaharisha maji", "kuendesha mara nyingi"],
                    "en": ["loose stools", "watery stool", "diarhea"]},
        "negated": {"sw": ["hajaharisha", "haharishi", "hana kuhara"],
                    "en": ["no diarrhoea", "no diarrhea"]},
    },
    "vomiting": {
        "train": {"sw": ["anatapika", "kutapika", "ametapika", "kutapika mara moja"],
                  "en": ["vomiting", "vomited", "throwing up"]},
        "heldout": {"sw": ["alitapika", "anatapka", "kutapika mara mbili", "tapika"],
                    "en": ["threw up", "vomits", "vomitting"]},
        "negated": {"sw": ["hatapiki", "hajatapika"],
                    "en": ["no vomiting", "not vomiting"]},
    },
    "pain": {
        "train": {"sw": ["maumivu ya tumbo", "tumbo linauma", "kichwa kinauma", "maumivu ya kichwa", "maumivu"],
                  "en": ["stomach pain", "headache", "abdominal pain", "pain"]},
        "heldout": {"sw": ["tumbo lina uma", "anaumwa na tumbo", "maumivu makali", "kichwa kinamuuma"],
                    "en": ["belly ache", "tummy ache", "head is paining"]},
        "negated": {"sw": ["hana maumivu", "tumbo haliumi"],
                    "en": ["no pain", "denies pain"]},
    },
    "weakness": {
        "train": {"sw": ["hana nguvu", "dhaifu", "mnyonge", "amechoka sana"],
                  "en": ["weak", "very weak", "no energy"]},
        "heldout": {"sw": ["ni dhaifu sana", "hana nguvu kabisa", "anaonekana mnyonge"],
                    "en": ["weakness", "tired and weak", "feels weak"]},
        "negated": {"sw": ["si dhaifu"],
                    "en": ["not weak"]},
    },
    "ds_cannot_drink": {
        "train": {"sw": ["hawezi kunywa", "hanyonyi", "amekataa kunyonya", "hawezi kunyonya", "hakunywa chochote"],
                  "en": ["cannot drink", "unable to breastfeed", "not able to drink", "unable to drink"]},
        "heldout": {"sw": ["hawezi kunywa chochote", "hakunywa kitu", "anakataa kunyonya", "hawezi kunywa maji"],
                    "en": ["cant drink", "refuses to breastfeed", "won't drink anything"]},
        "negated": {"sw": ["anakunywa vizuri", "ananyonya vizuri", "anaweza kunywa"],
                    "en": ["drinking well", "breastfeeding well", "can drink"]},
    },
    "ds_vomits_everything": {
        "train": {"sw": ["anatapika kila kitu", "kila anachokula anatapika", "anatapika kila anachokunywa"],
                  "en": ["vomits everything", "vomiting everything", "throws up everything"]},
        "heldout": {"sw": ["anatapka kila kitu", "kila kitu anatapika", "hawezi kubakiza chochote tumboni"],
                    "en": ["vomits all food", "cannot keep anything down"]},
        "negated": {"sw": [], "en": []},
    },
    "ds_convulsions": {
        "train": {"sw": ["degedege", "ana degedege", "alipata degedege", "kifafa", "mwili ulikuwa unatetemeka"],
                  "en": ["convulsions", "fits", "had convulsions"]},
        "heldout": {"sw": ["degedge", "alishikwa na degedege", "kutetemeka kwa mwili"],
                    "en": ["convulsing", "had a fit", "seizure"]},
        "negated": {"sw": ["hakuwa na degedege"],
                    "en": ["no convulsions", "no fits"]},
    },
    "ds_lethargic": {
        "train": {"sw": ["amelegea", "hajitambui", "amezimia", "hawezi kuamka", "usingizi mzito"],
                  "en": ["lethargic", "unconscious", "very sleepy", "hard to wake"]},
        "heldout": {"sw": ["amelegea sana", "hajitambui kabisa", "ni vigumu kumwamsha"],
                    "en": ["drowsy and floppy", "not responding", "letargic"]},
        "negated": {"sw": ["yuko macho", "anacheza vizuri"],
                    "en": ["alert", "playing normally"]},
    },
}

PATIENT = {"sw": ["mtoto", "mtoto wake", "mtoto wa Noor", "Amani", "msichana", "mvulana"],
           "en": ["child", "the child", "baby", "Amani", "the boy", "the girl"]}

OTHER = {"sw": ["mama", "mama yake", "baba", "bibi", "jirani"],
         "en": ["the mother", "father", "grandmother", "neighbour"]}

NUM_SW = {1: "moja", 2: "mbili", 3: "tatu", 4: "nne", 5: "tano", 6: "sita", 7: "saba"}
NUM_SW_AGE = {1: "mmoja", 2: "miwili", 3: "mitatu", 4: "minne", 5: "mitano"}

DISTRACT = {
    "sw": ["leo mvua imenyesha sana", "tulizungumza kuhusu kahawa", "familia ina shamba la mahindi",
           "nimepita kwa nyumba ya jirani", "mama anauza maziwa sokoni", "barabara ni mbaya baada ya mvua",
           "watoto wako shuleni", "tutarudi wiki ijayo kwa ziara", "nyumba ina maji safi",
           "wamepanda maharagwe", "kadi ya chanjo iko nyumbani", "baba yuko kazini", "tulipiga picha ya shamba",
           "bei ya kahawa imepanda", "ziara ya kawaida ya nyumbani"],
    "en": ["visited the household this morning", "family grows coffee and maize", "follow up visit planned",
           "the road was muddy", "discussed the vaccination card", "mother sells milk at the market",
           "routine household visit", "water point is far", "children are at school", "coffee price went up",
           "talked about the cooperative meeting", "next visit on friday"],
}
