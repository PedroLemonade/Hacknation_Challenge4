# Eingabe für den Swahili Check (Task T08)

Diese Datei komplett in ChatGPT einfügen, zusammen mit dem Prompt aus T08.

## A. Symptom Formulierungen (Training)

| Label | Pool | Swahili Formulierung |
|---|---|---|
| fever | train | ana homa |
| fever | train | homa kali |
| fever | train | mwili una joto |
| fever | train | joto jingi mwilini |
| fever | train | anaugua homa |
| fever | train | homa |
| fever | heldout | homma |
| fever | heldout | mwili wake una joto jingi |
| fever | heldout | joto kali la mwili |
| fever | heldout | ana homa za usiku |
| fever | negated | hana homa |
| fever | negated | hakuna homa |
| fever | negated | bila homa |
| cough | train | anakohoa |
| cough | train | ana kikohozi |
| cough | train | kikohozi kikali |
| cough | train | kukohoa sana |
| cough | train | kikohozi |
| cough | heldout | alikohoa usiku |
| cough | heldout | kikohozi kavu |
| cough | heldout | anakohowa |
| cough | heldout | kikohozi cha usiku |
| cough | negated | hakohoi |
| cough | negated | hana kikohozi |
| diarrhoea | train | anaharisha |
| diarrhoea | train | kuhara |
| diarrhoea | train | choo cha maji |
| diarrhoea | train | anaendesha |
| diarrhoea | train | kuharisha |
| diarrhoea | heldout | ameharisha |
| diarrhoea | heldout | kuharisha sana |
| diarrhoea | heldout | anaharisha maji |
| diarrhoea | heldout | kuendesha mara nyingi |
| diarrhoea | negated | hajaharisha |
| diarrhoea | negated | haharishi |
| diarrhoea | negated | hana kuhara |
| vomiting | train | anatapika |
| vomiting | train | kutapika |
| vomiting | train | ametapika |
| vomiting | train | kutapika mara moja |
| vomiting | heldout | alitapika |
| vomiting | heldout | anatapka |
| vomiting | heldout | kutapika mara mbili |
| vomiting | heldout | tapika |
| vomiting | negated | hatapiki |
| vomiting | negated | hajatapika |
| pain | train | maumivu ya tumbo |
| pain | train | tumbo linauma |
| pain | train | kichwa kinauma |
| pain | train | maumivu ya kichwa |
| pain | train | maumivu |
| pain | heldout | tumbo lina uma |
| pain | heldout | anaumwa na tumbo |
| pain | heldout | maumivu makali |
| pain | heldout | kichwa kinamuuma |
| pain | negated | hana maumivu |
| pain | negated | tumbo haliumi |
| weakness | train | hana nguvu |
| weakness | train | dhaifu |
| weakness | train | mnyonge |
| weakness | train | amechoka sana |
| weakness | heldout | ni dhaifu sana |
| weakness | heldout | hana nguvu kabisa |
| weakness | heldout | anaonekana mnyonge |
| weakness | negated | si dhaifu |
| ds_cannot_drink | train | hawezi kunywa |
| ds_cannot_drink | train | hanyonyi |
| ds_cannot_drink | train | amekataa kunyonya |
| ds_cannot_drink | train | hawezi kunyonya |
| ds_cannot_drink | train | hakunywa chochote |
| ds_cannot_drink | heldout | hawezi kunywa chochote |
| ds_cannot_drink | heldout | hakunywa kitu |
| ds_cannot_drink | heldout | anakataa kunyonya |
| ds_cannot_drink | heldout | hawezi kunywa maji |
| ds_cannot_drink | negated | anakunywa vizuri |
| ds_cannot_drink | negated | ananyonya vizuri |
| ds_cannot_drink | negated | anaweza kunywa |
| ds_vomits_everything | train | anatapika kila kitu |
| ds_vomits_everything | train | kila anachokula anatapika |
| ds_vomits_everything | train | anatapika kila anachokunywa |
| ds_vomits_everything | heldout | anatapka kila kitu |
| ds_vomits_everything | heldout | kila kitu anatapika |
| ds_vomits_everything | heldout | hawezi kubakiza chochote tumboni |
| ds_convulsions | train | degedege |
| ds_convulsions | train | ana degedege |
| ds_convulsions | train | alipata degedege |
| ds_convulsions | train | kifafa |
| ds_convulsions | train | mwili ulikuwa unatetemeka |
| ds_convulsions | heldout | degedge |
| ds_convulsions | heldout | alishikwa na degedege |
| ds_convulsions | heldout | kutetemeka kwa mwili |
| ds_convulsions | negated | hakuwa na degedege |
| ds_lethargic | train | amelegea |
| ds_lethargic | train | hajitambui |
| ds_lethargic | train | amezimia |
| ds_lethargic | train | hawezi kuamka |
| ds_lethargic | train | usingizi mzito |
| ds_lethargic | heldout | amelegea sana |
| ds_lethargic | heldout | hajitambui kabisa |
| ds_lethargic | heldout | ni vigumu kumwamsha |
| ds_lethargic | negated | yuko macho |
| ds_lethargic | negated | anacheza vizuri |

## B. Personen und Ablenkungssätze

mtoto, mtoto wake, mtoto wa Noor, Amani, msichana, mvulana, mama, mama yake, baba, bibi, jirani

* leo mvua imenyesha sana
* tulizungumza kuhusu kahawa
* familia ina shamba la mahindi
* nimepita kwa nyumba ya jirani
* mama anauza maziwa sokoni
* barabara ni mbaya baada ya mvua
* watoto wako shuleni
* tutarudi wiki ijayo kwa ziara
* nyumba ina maji safi
* wamepanda maharagwe
* kadi ya chanjo iko nyumbani
* baba yuko kazini
* tulipiga picha ya shamba
* bei ya kahawa imepanda
* ziara ya kawaida ya nyumbani

## C. Oberflächen Texte (Swahili Block aus app/i18n.js, 161 Schlüssel)

| Schlüssel | Text |
|---|---|
| tagline | Kumbukumbu ya ziara hadi rasimu ya rufaa |
| tab_visit | Ziara |
| tab_facilities | Vituo |
| tab_about | Kuhusu |
| offline_ready | Tayari bila mtandao |
| offline_now | Hakuna mtandao, yote yanafanya kazi |
| offline_loading | Inahifadhi kwa matumizi bila mtandao |
| offline_no | Mtandaoni tu |
| steps | Kumbukumbu,Kagua,Kamilisha,Rufaa |
| hero_eyebrow | Ziara ya nyumbani |
| hero_title | Andika ulichosikia. Kagua AfyaNote inachopata. |
| hero_body | Mgonjwa mmoja kwa kila kumbukumbu. Kiswahili, Kiingereza au mchanganyiko. Majina hayahitajiki. |
| stat_offline | Inafanya kazi bila mtandao |
| stat_model | Modeli kwenye simu |
| stat_terms | Maneno ya kumbukumbu |
| stat_sent | Imetumwa kwa seva |
| note_label | Kumbukumbu ya ziara |
| examples | Mifano ya kubuni |
| analyse | Pendekeza sehemu |
| chars | herufi |
| privacy | Hakuna kinachotoka kwenye simu hii. Hakuna kinachohifadhiwa baada ya kuanza kesi mpya. |
| err_empty | Tafadhali andika kumbukumbu kwanza. |
| err_too_long | Tafadhali tumia herufi chini ya 600. |
| err_no_text | Kumbukumbu haina maneno yanayosomeka. |
| err_model | Modeli haikupakiwa. Fungua programu mara moja ukiwa na mtandao. |
| review_title | Kagua kila pendekezo |
| review_help | Kila kadi inaonyesha linakotoka. Chagua hali, kisha thibitisha au kataa. |
| checked | yamekaguliwa |
| no_candidates | Hakuna neno linalotambulika. Unaweza kuandika mwenyewe. |
| suggested | Limependekezwa |
| unclear | Halieleweki |
| st_stated | Imetajwa |
| st_denied | Imekanushwa |
| st_other_person | Mtu mwingine |
| st_past | Zamani |
| st_conflict | Zinapingana, chagua |
| confirm | Thibitisha |
| reject | Kataa |
| confirmed | Imethibitishwa |
| rejected | Imekataliwa |
| edited | umebadilisha |
| evidence | Kutoka kwenye kumbukumbu |
| duration | Muda |
| day | siku |
| days | siku |
| not_used | Haijalinganishwa, inabaki kwenye kumbukumbu asili |
| age | Umri |
| age_missing | Haujatajwa |
| age_unclear | Haueleweki |
| age_from_note | Kutoka kwenye kumbukumbu |
| danger_title | Linganisha na mwongozo wako |
| danger_body | Maneno uliyothibitisha yanajumuisha dalili za hatari za WHO (IMCI):  |
| danger_note | AfyaNote haiamui uharaka. Wewe ndiye unaamua hatua inayofuata. |
| next | Endelea |
| back | Rudi |
| complete_title | Ongeza yasiyotajwa |
| case_id | Namba ya kesi |
| sex | Jinsia |
| sex_f | Mwanamke |
| sex_m | Mwanaume |
| sex_x | Haijarekodiwa |
| age_value | Umri |
| age_unit | Kipimo |
| years | miaka |
| months | miezi |
| referral_time | Tarehe na saa ya rufaa |
| treatment | Matibabu yaliyotolewa (kama yalitolewa) |
| treatment_ph | Acha wazi kama hayakutajwa |
| profile | Wasifu wa majaribio, wa kubuni |
| chu | Kitengo cha afya ya jamii |
| facility | Kituo cha afya kinachohusika |
| chp | Mhamasishaji wa afya ya jamii |
| pick_facility | Chagua kwenye ramani |
| consent | Mteja amearifiwa na amekubali rufaa. |
| handover_title | Rasimu ya rufaa |
| handover_sub | Kwa mfumo wa MOH 100, sehemu A. Sehemu B hujazwa na kituo kinachopokea. |
| status_draft | Rasimu |
| status_reviewed | Umekagua |
| open | wazi |
| main_problems | Tatizo kuu |
| comments | Maoni |
| original_note | Kumbukumbu asili |
| documented_absent | Imeandikwa kuwa haipo |
| other_or_past | Imetajwa, si ya mgonjwa huyu au si ya sasa |
| created | Rasimu imeundwa (saa ya simu) |
| export_json | Pakua JSON |
| copy_text | Nakili maandishi |
| copied | Imenakiliwa |
| export_note | Kupakua kunathibitisha uandishi, si usahihi wa kitabibu. |
| need_review | Kagua mapendekezo yote na weka alama ya ridhaa. |
| new_case | Kesi mpya |
| fac_title | Vituo vya afya karibu na kitengo |
| fac_note | Data ya majaribio, majina na mahali ni ya kubuni. Umbali wa mstari ulionyooka kutoka kitengo. |
| fac_search | Tafuta kituo |
| fac_all | Vyote |
| fac_dispensary | Zahanati |
| fac_health_centre | Kituo cha afya |
| fac_hospital | Hospitali |
| type_dispensary | Zahanati |
| type_health_centre | Kituo cha afya |
| type_hospital_l4 | Hospitali ya kaunti ndogo |
| type_hospital_l5 | Hospitali ya rufaa ya kaunti |
| level | Ngazi |
| straight | mstari ulionyooka |
| km | km |
| walk | kutembea takriban |
| min | dak |
| h | saa |
| use_facility | Tumia kama kituo kinachohusika |
| used_facility | Kituo cha kesi hii |
| close | Funga |
| about_title | Kuhusu AfyaNote |
| why_words | Maneno yaliyosababisha pendekezo hili |
| analysed_in | Imechambuliwa kwenye kifaa hiki kwa |
| no_network | bila mtandao |
| show_qr | Onyesha QR ya kukabidhi |
| qr_title | Kabidhi bila mtandao |
| qr_note | Mhudumu wa kituo anaskani kwa kamera ya simu yoyote na anapata rasimu kama maandishi. Yeyote anayeskani anapata nakala, kwa hiyo mwonyeshe mhudumu anayepokea tu. |
| how_title | Jinsi AfyaNote inavyofanya kazi |
| pipe_1 | Kumbukumbu |
| pipe_1s | Kiswahili, Kiingereza au mchanganyiko, imegawanywa vipande |
| pipe_2 | Modeli ndogo kwenye simu |
| pipe_2s | inapendekeza neno 1 kati ya 10 kwa kila kipande na kuonyesha maneno yaliyosababisha |
| pipe_3 | Kanuni |
| pipe_3s | imekanushwa, mtu mwingine, zamani, kauli zinapingana, muda, umri wenye kipimo |
| pipe_4 | Wewe unaamua |
| pipe_4s | thibitisha, badilisha au kataa kila kipengele kabla rasimu haijaundwa |
| compare_title | Jaribu: modeli ndogo dhidi ya orodha ya maneno |
| compare_help | Andika kumbukumbu fupi. Zote zinaendeshwa kwenye simu hii. Orodha ya maneno inajua maneno yale yale ya mafunzo lakini si tahajia tofauti. |
| compare_model | modeli ndogo |
| compare_keywords | Orodha ya maneno |
| nothing_found | hakuna kilichopatikana |
| facts_title | Takwimu |
| ex_sw | Kiswahili |
| ex_mixed | Mchanganyiko |
| ex_en | Kiingereza |
| ex_hard | Kesi ngumu |
| not_stated | haijatajwa |
| fr_model | Modeli |
| fr_features | vipengele |
| fr_terms | maneno |
| fr_thresholds | Viwango |
| fr_suggest | pendekeza |
| fr_unclear | haijulikani |
| fr_unseen | Maneno mapya (F1) |
| fr_typos | Makosa ya tahajia (F1) |
| fr_contrast | Majaribio ya kulinganisha |
| fr_data | Data ya mafunzo |
| fr_data_v | Vipande vya kubuni vya Kiswahili, Kiingereza na mchanganyiko. Havijakaguliwa na wazungumzaji asilia wala wataalamu wa afya. |
| fr_unsupported | Haitumiki |
| fr_unsupported_v | Kikuyu na lugha nyingine, sauti, zaidi ya mgonjwa mmoja kwa kumbukumbu moja. |
| fr_case | Data ya kesi |
| fr_case_v | Inabaki kwenye kumbukumbu ya kifaa hiki. Hakuna kinachotumwa kwa seva. Kesi mpya inaifuta. QR ina nakala ya rasimu: ionyeshe tu kwa mtaalamu wa kituo kinachopokea. |
| fr_facilities | Vituo |
| fr_facilities_v | Orodha ya majaribio ya kubuni. Ibadilishwe na Kenya Master Health Facility List au healthsites.io kabla ya matumizi halisi. |
| fr_form | Fomu |
| fr_form_v | Imeelekezwa kwenye MOH 100 sehemu A (kiolezo cha zamani). Si fomu rasmi. |
| fr_thirdparty | Msimbo wa wengine |
| fr_thirdparty_v | QR Code Generator ya Kazuhiko Arase (MIT). Mengine yote yameandikwa kwa mfano huu. |
| fr_disclaimer | AfyaNote ni mfano wa hackathon. Haitambui ugonjwa, haiweki uharaka na haijaidhinishwa kwa matumizi ya kitabibu. Kumbukumbu, watu na vituo vyote vya mfano ni vya kubuni. |
| lang | English |

## D. Beispielnotizen in der App

* Mtoto wa miaka miwili ana homa siku tatu na anakohoa. Hawezi kunywa tangu jana. Hana kuhara.
* Mama anasema mtoto alipata degedege usiku na amelegea. Hana homa. Homa leo asubuhi.