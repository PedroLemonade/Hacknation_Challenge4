"""Renders slides to PNG, records demo clips and README screenshots.
Usage: python3 tools/make_media.py http://localhost:8000/   (app served from app/)
Needs Playwright with Chromium and ffmpeg. Output: docs/05_pitch/assets/ and docs/screenshots/"""
import sys, os, subprocess, shutil, glob, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/"
# optional 2nd argument: output folder name, e.g. claude_v0413 -> docs/05_pitch/assets/claude_v0413/ (screenshots inside it too)
SUB = sys.argv[2] if len(sys.argv) > 2 else None
A = ROOT / "docs/05_pitch/assets" / SUB if SUB else ROOT / "docs/05_pitch/assets"
S = A / "screenshots" if SUB else ROOT / "docs/screenshots"
TMP = ROOT / ".media_tmp"
for d in (A, S, TMP): d.mkdir(parents=True, exist_ok=True)

def mp4(webm, out, pad=False):
    vf = "scale=trunc(iw/2)*2:trunc(ih/2)*2"
    if pad:  # phone clip centred on a 1920x1080 canvas in the app background colour
        vf = "scale=-2:1000,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0xf3f0e7"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(webm), "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", str(out)], check=True)

def slow(page, ms=900): page.wait_for_timeout(int(ms * 1.6))  # calm pace for voice over

with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- slides ----
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((ROOT / "docs/05_pitch/slides.html").as_uri()); pg.wait_for_timeout(400)
    n = pg.evaluate("document.querySelectorAll('.slide').length")
    for i in range(n):
        pg.evaluate(f"goSlide({i})"); pg.wait_for_timeout(150)
        pg.screenshot(path=str(A / f"slide_{i+1}.png"))
    pg.close()

    # ---- warm up service worker cache in a persistent profile-less context ----
    def phone_ctx(record=True):
        # 540x1170 keeps the phone layout (<960px) and records at a usable resolution
        return b.new_context(viewport={"width": 540, "height": 1170}, device_scale_factor=1,
                             record_video_dir=str(TMP) if record else None, record_video_size={"width": 540, "height": 1170})

    # ---- clip 1: main flow ----
    ctx = phone_ctx(); page = ctx.new_page()
    page.goto(URL); slow(page, 2500)
    page.screenshot(path=str(S / "01_start.png"))
    page.click("#note"); page.type("#note", "Mtoto wa miaka miwili ana homa siku tatu na anakohoa. Hawezi kunywa tangu jana. Hana kuhara.", delay=45)
    slow(page, 800); page.click("#goAnalyse"); slow(page, 1600)
    page.screenshot(path=str(S / "02_review.png"))
    for lab in [c.get_attribute("data-ok") for c in page.query_selector_all("[data-ok]")]:
        page.locator(f"[data-card='{lab}']").scroll_into_view_if_needed(); slow(page, 700)
        page.click(f"[data-ok='{lab}']"); slow(page, 700)
    page.locator("#ageOk").scroll_into_view_if_needed(); slow(page, 500); page.click("#ageOk"); slow(page, 1200)
    if page.query_selector("[data-dur]"):  # "ask before you leave": the family answers, the CHP types the days
        g = page.locator("[data-dur]").first; g.scroll_into_view_if_needed(); slow(page, 1200)
        g.click(); g.type("4", delay=120); g.evaluate("e => e.blur()"); slow(page, 1500)
    page.screenshot(path=str(S / "03_reviewed.png"))
    page.click("#next"); slow(page, 900)
    page.type("#f_caseId", "KE-DEMO-001", delay=40); page.select_option("#f_sex", "female"); slow(page, 600)
    page.locator("#pickFac").scroll_into_view_if_needed(); page.click("#pickFac"); slow(page, 1500)
    page.screenshot(path=str(S / "04_facilities.png"))
    page.click("button.fitem >> nth=3"); slow(page, 1500)
    page.screenshot(path=str(S / "05_facility_sheet.png"))
    page.click("#useFac"); slow(page, 900)
    page.locator("#consent").scroll_into_view_if_needed(); page.check("#consent"); slow(page, 900)
    page.click("#next"); slow(page, 1500)
    page.screenshot(path=str(S / "06_handover.png"))
    page.mouse.wheel(0, 600); slow(page, 1500); page.mouse.wheel(0, 600); slow(page, 1200)
    page.click("#qrBtn"); slow(page, 2500)
    page.screenshot(path=str(S / "06b_qr_handover.png"))
    v1 = page.video.path(); ctx.close()

    # ---- clip 3: model vs keyword list (About tab), offline ----
    ctx = phone_ctx(); page = ctx.new_page()
    page.goto(URL); slow(page, 2000); ctx.set_offline(True); slow(page, 600)
    page.click("#tabbar [data-tab='about']"); slow(page, 1500)
    page.locator("#cmpInput").scroll_into_view_if_needed(); slow(page, 1200)
    for k in range(3):
        page.click(f"[data-cmpex='{k}']"); slow(page, 1700)
    page.screenshot(path=str(S / "10_compare.png"))
    v3 = page.video.path(); ctx.close()

    # ---- clip 2: hard case (conflict + other person) ----
    ctx = phone_ctx(); page = ctx.new_page()
    page.goto(URL); slow(page, 2000)
    page.click("[data-ex='3']"); slow(page, 1200); page.click("#goAnalyse"); slow(page, 1800)
    card = page.locator("[data-card='fever']"); card.scroll_into_view_if_needed(); slow(page, 2000)
    page.screenshot(path=str(S / "07_conflict.png"))
    page.check("input[data-as='fever'][value='stated']", force=True); slow(page, 900)
    page.click("[data-ok='fever']"); slow(page, 1500)
    page.click(".topbar [data-lang]"); slow(page, 1800)
    page.screenshot(path=str(S / "08_swahili.png"))
    v2 = page.video.path(); ctx.close()

    # ---- desktop screenshot ----
    dk = b.new_page(viewport={"width": 1440, "height": 900})
    dk.goto(URL); dk.wait_for_timeout(1500); dk.click("[data-ex='1']"); dk.click("#goAnalyse"); dk.wait_for_timeout(500)
    dk.screenshot(path=str(S / "09_desktop_review.png")); dk.close()
    b.close()

mp4(v1, A / "demo_main_phone.mp4"); mp4(v1, A / "demo_main_1080p.mp4", pad=True)
mp4(v2, A / "demo_hardcase_phone.mp4"); mp4(v2, A / "demo_hardcase_1080p.mp4", pad=True)
mp4(v3, A / "demo_compare_phone.mp4"); mp4(v3, A / "demo_compare_1080p.mp4", pad=True)
shutil.rmtree(TMP, ignore_errors=True)
print("slides:", n, "assets:", sorted(os.listdir(A)), "screenshots:", sorted(os.listdir(S)))
