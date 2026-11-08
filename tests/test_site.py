import os, re, json
from playwright.sync_api import sync_playwright

url="file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
res=[]
def ok(name,cond,extra=""):
    res.append((name,bool(cond),extra)); print(("PASS " if cond else "FAIL ")+name, extra)
with sync_playwright() as p:
    b=p.chromium.launch()
    for label,vw,vh in [("desktop",1280,800),("mobile",390,844)]:
        pg=b.new_page(viewport={"width":vw,"height":vh})
        errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e)))
        pg.on("console",lambda m:errs.append(m.text) if m.type=="error" and "fonts.g" not in m.text and "net::" not in m.text else None)
        pg.goto(url); pg.wait_for_timeout(800)
        ok(f"[{label}] no JS errors",not errs,str(errs))
        r=pg.evaluate("""()=>{const a=document.querySelector('.avatar'),i=a.querySelector('img');
          const ca=getComputedStyle(a),ci=getComputedStyle(i),ra=a.getBoundingClientRect();
          return {br:ca.borderRadius,ibr:ci.borderRadius,w:ra.width,h:ra.height,loaded:i.complete&&i.naturalWidth>0,
                  hscroll:document.documentElement.scrollWidth>innerWidth}}""")
        ok(f"[{label}] avatar is a circle",r["br"] in("50%",f"{r['w']/2}px") and abs(r['w']-r['h'])<1,str(r))
        ok(f"[{label}] photo loads",r["loaded"])
        ok(f"[{label}] no horizontal scroll",not r["hscroll"])
        bg=pg.evaluate("""()=>{const l=document.querySelector('.bg');
          return {z:getComputedStyle(l).zIndex,pos:getComputedStyle(l).position,player:!!document.querySelector('#bgPlayer, #bgVideo iframe')}}""")
        ok(f"[{label}] video background sits behind the page",bg["z"]=="-1" and bg["pos"]=="fixed" and bg["player"],str(bg))
        ok(f"[{label}] enter screen shows on load",pg.is_visible("#enter"))
        pg.click("#enterBtn"); pg.wait_for_timeout(600)
        ok(f"[{label}] enter screen closes after entering",not pg.is_visible("#enter"))
        pg.screenshot(path=f"/home/claude/shot_{label}.png")
        if label=="mobile":
            pg.click("#menu"); ok("[mobile] menu opens",pg.evaluate("document.getElementById('nav').classList.contains('open')"))
            pg.click("#nav a[href='#projects']"); pg.wait_for_timeout(700)
            ok("[mobile] nav link scrolls",pg.evaluate("scrollY")>300)
        else:
            for h in ["home","about","skills","projects","achievements","education","contact"]:
                ok(f"[desktop] section #{h} exists",pg.query_selector("#"+h) is not None)
            pg.click("#tabs .tab:nth-child(2)"); pg.wait_for_timeout(300)
            ok("[desktop] skills tab switches",pg.evaluate("document.querySelectorAll('#skillGrid .skill').length")==6)
            certs=pg.evaluate("""()=>[...document.querySelectorAll('#achievements .cert-links')].map(l=>[...l.querySelectorAll('a')].map(a=>a.getAttribute('href')))""")
            ok("[desktop] 3 certificates link to a PDF and a Coursera verify page",len(certs)==3 and all(len(c)==2 and c[0].endswith('.pdf') and 'coursera.org/verify/' in c[1] for c in certs),str(certs))
            ok("[desktop] certificate PDFs exist",all(os.path.exists(os.path.join(os.path.dirname(__file__),"..",c[0])) for c in certs))
            labels=pg.evaluate("[...document.querySelectorAll('.info .label')].map(l=>l.textContent)")
            ok("[desktop] contact rows are labelled",labels==["Email","Phone number","GitHub","LinkedIn","Place"],str(labels))
            pg.click("#theme"); ok("[desktop] theme toggles",pg.evaluate("document.documentElement.dataset.theme")in("dark","light"))
            pg.click("#form button"); ok("[desktop] form validation shows errors",pg.evaluate("[...document.querySelectorAll('.err')].every(e=>e.textContent.length>0)"))
    b.close()
print(f"\n{sum(1 for r in res if r[1])}/{len(res)} passed")
