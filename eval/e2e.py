"""End to end browser test for AfyaNote v2.
Usage: python3 eval/e2e.py http://localhost:8000/ /tmp/shots
Checks: full flow online (note, review, complete with facility from map, handover), offline restart,
no requests leaving the origin while offline, no console errors, no horizontal scroll on phone width."""
import sys
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/"
SHOTS = sys.argv[2] if len(sys.argv) > 2 else "/tmp"
errors, offline_requests, problems = [], [], []

def check(cond, msg):
    if not cond: problems.append(msg)

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page = ctx.new_page()
    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL); page.wait_for_timeout(2500)
    page.screenshot(path=f"{SHOTS}/01_start.png")
    check("Ready offline" in page.inner_text("#offlinePill"), "offline pill not ready")
    check(page.evaluate("document.documentElement.scrollWidth") <= 390, "horizontal scroll on phone")

    page.click("[data-ex='0']"); page.click("#goAnalyse"); page.wait_for_timeout(300)
    page.screenshot(path=f"{SHOTS}/02_review.png", full_page=True)
    labels = [c.get_attribute("data-ok") for c in page.query_selector_all("[data-ok]")]
    print("candidates:", labels)
    check(set(labels) >= {"fever", "cough", "ds_cannot_drink", "diarrhoea"}, "missing expected candidates")
    check(page.is_checked("input[data-as='diarrhoea'][value='denied']"), "diarrhoea not marked denied")
    check(page.locator("[data-card='fever'] b.why").count() >= 1, "no key words highlighted")
    check("ms" in page.inner_text("main"), "timing line missing")
    check(page.is_disabled("#next"), "next enabled before review")
    for lab in labels: page.click(f"[data-ok='{lab}']")
    page.click("#ageOk"); page.wait_for_timeout(100)
    page.screenshot(path=f"{SHOTS}/03_reviewed.png", full_page=True)
    check(page.is_enabled("#next"), "next disabled after review")
    page.click("#next"); page.wait_for_timeout(200)

    page.fill("#f_caseId", "KE-DEMO-001"); page.select_option("#f_sex", "female")
    page.click("#pickFac"); page.wait_for_timeout(200)
    page.screenshot(path=f"{SHOTS}/04_facilities.png", full_page=True)
    page.click("button.fitem >> nth=3"); page.wait_for_timeout(200)
    page.screenshot(path=f"{SHOTS}/05_sheet.png")
    page.click("#useFac"); page.wait_for_timeout(200)
    check(page.input_value("#f_facility") != "", "facility not filled after pick")
    page.check("#consent")
    page.screenshot(path=f"{SHOTS}/06_complete.png", full_page=True)
    page.click("#next"); page.wait_for_timeout(200)
    page.screenshot(path=f"{SHOTS}/07_handover.png", full_page=True)
    check(page.is_enabled("#copyBtn"), "export disabled after full review")
    page.click("#qrBtn"); page.wait_for_timeout(400)
    page.screenshot(path=f"{SHOTS}/07b_qr.png")
    page.locator(".qrbox").screenshot(path=f"{SHOTS}/qr_only.png")
    try:
        import cv2
        img = cv2.imread(f"{SHOTS}/qr_only.png"); data, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
        print("qr decoded chars:", len(data)); check("Fever (3 days)" in data and "KE-DEMO-001" in data, "QR content wrong or unreadable")
    except ImportError:
        print("opencv missing, QR decode skipped")
    page.click("[data-closeqr] >> nth=1"); page.wait_for_timeout(200)
    txt = page.inner_text(".form")
    check("Fever (3 days)" in txt and "Not able to drink or breastfeed (1 day)" in txt, "main problems wrong in handover")

    page.wait_for_timeout(1000)
    ctx.set_offline(True)
    page.on("request", lambda r: offline_requests.append(r.url))
    page.reload(); page.wait_for_timeout(1500)
    page.click("[data-ex='3']"); page.click("#goAnalyse"); page.wait_for_timeout(300)
    page.screenshot(path=f"{SHOTS}/08_offline_hardcase.png", full_page=True)
    check(page.query_selector("[data-ok='fever']").is_disabled(), "conflict fever can be confirmed without choice")
    page.click("#tabbar [data-tab='facilities']"); page.wait_for_timeout(200)
    page.screenshot(path=f"{SHOTS}/09_facilities_offline.png")
    page.click(".topbar [data-lang]"); page.click("#tabbar [data-tab='visit']"); page.wait_for_timeout(200)
    page.screenshot(path=f"{SHOTS}/10_sw.png")
    page.click("#tabbar [data-tab='about']"); page.wait_for_timeout(200)
    page.click("[data-cmpex='0']"); page.wait_for_timeout(200)
    cols = page.query_selector_all(".cmpcol")
    nm, nk = cols[0].inner_text().count("\n"), cols[1].inner_text().count("\n")
    print("compare model vs keywords chips:", len(cols[0].query_selector_all(".tchip")), len(cols[1].query_selector_all(".tchip")))
    check(len(cols[0].query_selector_all(".tchip")) > len(cols[1].query_selector_all(".tchip")), "model not ahead on held out example")
    page.screenshot(path=f"{SHOTS}/12_about_compare.png", full_page=True)
    leaks = [u for u in offline_requests if not u.startswith(URL)]
    check(not leaks, f"requests outside origin while offline: {leaks}")

    desk = b.new_page(viewport={"width": 1280, "height": 820})
    desk.goto(URL); desk.wait_for_timeout(1200)
    desk.click("[data-ex='1']"); desk.click("#goAnalyse"); desk.wait_for_timeout(300)
    desk.screenshot(path=f"{SHOTS}/11_desktop_review.png")
    b.close()

print("errors:", errors)
print("problems:", problems)
print("PASS" if not errors and not problems else "FAIL")
sys.exit(0 if not errors and not problems else 1)
