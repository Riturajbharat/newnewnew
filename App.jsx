import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion'

/* ══════════════════════════
   DATA
══════════════════════════ */
const COURSES = [
  { num:'01', tier:'Beginner',      grades:'Grade Initial – 3', age:'Ages 7 & above',  price:'₹1,000', tag:'Foundation',   feat:['Scales & arpeggios','Simple repertoire','Sight-reading basics','Aural training','Hand coordination'] },
  { num:'02', tier:'Intermediate',  grades:'Grade 4 – 5',       age:'All ages',        price:'₹1,000', tag:'Musicianship',  feat:['Personal interpretation','Advanced scales','Stylistic accuracy','Advanced sight-reading','Harmonic progressions'] },
  { num:'03', tier:'Advanced',      grades:'Grade 6 – 8',       age:'Pre-professional',price:'₹2,000', tag:'Mastery', hot:true,feat:['Complex repertoire','Concert preparation','Professional technique','Advanced interpretation','Performance maturity'] },
  { num:'04', tier:'Little Mozart', grades:'Alfred Method',     age:'Ages 4 – 6',      price:'₹1,000', tag:'Early Childhood',feat:['Music fundamentals','Rhythm & melody','Keyboard intro','Singing & movement','Child-centred learning'] },
]
const TEAM = [
  { name:'Pradeep Chaturvedi',    role:'Founder & Principal',           tag:'Trinity Representative',               img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-1-1024x1024.png',      quote:'Pioneer of Western classical piano in Rajasthan.' },
  { name:'Mani Chaturvedi',       role:'Co-Founder · Senior Faculty',   tag:'First Female Piano Tutor in Rajasthan',img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/maam-1024x1024.png',       quote:'Award-winning educator. National-level achiever.' },
  { name:'Yashaswini Chaturvedi', role:'Instructor · Grade 8',          tag:'Psychology + Music',                   img:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/Yashaswini-1024x1024.jpg', quote:'Holistic, deeply personalised mentorship.' },
]
const FAQS = [
  { q:'What age groups do you accept?', a:'We welcome students from age 4 through to adults. Our Little Mozart programme serves ages 4–6, while the graded syllabus caters to all levels from Grade Initial to Grade 8.' },
  { q:'Do you prepare for Trinity examinations?', a:'Yes. As the authorised regional representative of Trinity College London, Pradeep Chaturvedi conducts internationally recognised examinations — performance, theory, sight-reading and aural skills.' },
  { q:'Is prior musical experience required?', a:'No prior experience is needed for beginner enrolments. For intermediate and advanced levels, we assess each student individually and place them at the appropriate grade.' },
  { q:'What makes Soul of Symphony different?', a:'We are exclusively piano-focused — a conservatoire, not a hobby class. Our approach prioritises discipline, artistry and international standards. Students achieve national ranks and gain entry to premier music schools.' },
  { q:'Are there performance opportunities?', a:'Yes — annual concerts, recitals and curated performance events develop stage confidence, performance maturity and artistic presence.' },
]
const ALUMNI = ['Vikram Singh — Bollywood Composer','Vikas Bagla — Sound Engineer, University of York','Ankit Kar — Pianist, TATHAASTU','Shashwat Sachdev — Composer & Singer','Ashok Bishnoi — Rapper & Music Producer','Vipul Gupta — Rank 1, India 2011']
const REELS = [
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/%F0%9F%8E%B9-Meet-Aanya-%E2%80%94-pouring-her-heart-into-Tujhe-Kitna-Chahne-Lage-Hum-on-the-piano-%F0%9F%92%96From-her-fir.mp4', tag:'Performance', title:"Aanya — Tujhe Kitna Chahne Lage" },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/I-played-the-pain-I-never-spoke-Bekhayali-on-PianoI-hope-you-like-it-kabirsingh-bekhayalip.mp4', tag:'Cover', title:'Bekhayali — Playing the pain' },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/get.mp4', tag:'Studio', title:'Behind the keys — Mastery' },
  { src:'https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/%F0%9F%8E%B9%E2%9C%A8-Experience-the-timeless-beauty-of-Words-by-Boyzone-in-this-heartfelt-piano-cover-by-Ranvir-J.mp4', tag:'Classic', title:"Ranvir — Words by Boyzone" },
]

/* ══════════════════════════
   HELPERS
══════════════════════════ */
const EZ = [.22,1,.36,1]
const rv = (delay=0,y=40,dur=.9) => ({
  initial:{opacity:0,y},
  whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:'0px 0px -60px 0px'},
  transition:{duration:dur,delay,ease:EZ},
})
const rh = (delay=0) => ({
  initial:{scaleX:0},
  whileInView:{scaleX:1},
  viewport:{once:true,margin:'0px 0px -60px 0px'},
  transition:{duration:.9,delay,ease:EZ},
  style:{transformOrigin:'left'},
})

/* scroll progress bar */
function Bar(){
  const {scrollYProgress}=useScroll()
  const sx=useSpring(scrollYProgress,{stiffness:100,damping:30})
  return <motion.div style={{position:'fixed',top:0,left:0,right:0,height:'2px',background:'var(--felt)',transformOrigin:'left',scaleX:sx,zIndex:9999}}/>
}

/* ══════════════════════════
   CURSOR — Ayana style
══════════════════════════ */
function Cursor(){
  const dot=useRef(null),ring=useRef(null),lbl=useRef(null)
  useEffect(()=>{
    if(!window.matchMedia('(pointer:fine)').matches)return
    let mx=0,my=0,rx=0,ry=0,raf
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY})
    const loop=()=>{
      if(dot.current){dot.current.style.left=mx+'px';dot.current.style.top=my+'px'}
      rx+=(mx-rx)*.12;ry+=(my-ry)*.12
      if(ring.current){ring.current.style.left=rx+'px';ring.current.style.top=ry+'px'}
      raf=requestAnimationFrame(loop)
    }
    raf=requestAnimationFrame(loop)
    const on=e=>{const t=e.currentTarget.dataset.cur||'';document.body.dataset.cs=t?'lbl':'hov';if(lbl.current)lbl.current.textContent=t}
    const off=()=>{document.body.dataset.cs='';if(lbl.current)lbl.current.textContent=''}
    const bind=()=>document.querySelectorAll('a,button,[data-cur]').forEach(el=>{el.addEventListener('mouseenter',on);el.addEventListener('mouseleave',off)})
    bind()
    const ob=new MutationObserver(bind)
    ob.observe(document.body,{childList:true,subtree:true})
    return()=>{cancelAnimationFrame(raf);ob.disconnect()}
  },[])
  return(
    <>
      <style>{`
        .cd{width:6px;height:6px;background:var(--felt);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;transform:translate(-50%,-50%);z-index:10000;transition:width .2s,height .2s}
        .cr{width:36px;height:36px;border:1px solid rgba(13,12,10,.3);border-radius:50%;position:fixed;top:0;left:0;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .4s var(--ease),height .4s var(--ease),background .3s,border-color .3s;display:flex;align-items:center;justify-content:center}
        .cl{font-family:'Cinzel',serif;font-size:.42rem;letter-spacing:.18em;color:var(--ivory);text-transform:uppercase;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}
        [data-cs="hov"] .cd{width:4px;height:4px}
        [data-cs="hov"] .cr{width:52px;height:52px;border-color:var(--brass);background:rgba(184,125,42,.08)}
        [data-cs="lbl"] .cd{opacity:.3}
        [data-cs="lbl"] .cr{width:72px;height:72px;background:var(--felt);border-color:var(--felt)}
        [data-cs="lbl"] .cl{opacity:1}
        @media(pointer:coarse){.cd,.cr{display:none}}
      `}</style>
      <div ref={dot} className="cd"/>
      <div ref={ring} className="cr"><span ref={lbl} className="cl"/></div>
    </>
  )
}

/* ══════════════════════════
   LOADER — piano keys animation
══════════════════════════ */
function Loader({onDone}){
  const [pct,setPct]=useState(0)
  useEffect(()=>{
    let v=0;const t=setInterval(()=>{v+=Math.random()*16+7;if(v>=100){v=100;clearInterval(t);setTimeout(onDone,600)}setPct(Math.round(v))},85)
    return()=>clearInterval(t)
  },[])
  const wkeys=Array.from({length:14})
  const blk=[0,1,3,4,5,7,8,10,11,12] // which white keys get a black key to their right
  return(
    <motion.div style={{position:'fixed',inset:0,background:pct>60?'var(--ebony)':'var(--ivory)',zIndex:9998,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'3rem',transition:'background 1s ease'}}
      exit={{opacity:0,y:-20}} transition={{duration:.7,ease:EZ}}>
      {/* animated piano keys */}
      <motion.div style={{display:'flex',alignItems:'flex-end',gap:'2px',height:'90px',position:'relative'}}
        initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:EZ}}>
        {wkeys.map((_,i)=>(
          <motion.div key={i} style={{width:'28px',height:'90px',background:pct>60?'var(--ivory)':'var(--ebony)',borderRadius:'0 0 3px 3px',border:`1px solid ${pct>60?'rgba(237,232,220,.3)':'rgba(13,12,10,.4)'}`,position:'relative',flexShrink:0,transition:'background .8s'}}
            initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:.4,delay:i*.04,ease:EZ,transformOrigin:'top'}}>
            {blk.includes(i)&&<div style={{position:'absolute',top:0,right:'-9px',width:'16px',height:'56px',background:pct>60?'var(--ebony)':'var(--ivory)',zIndex:2,borderRadius:'0 0 3px 3px',transition:'background .8s'}}/>}
          </motion.div>
        ))}
      </motion.div>
      <motion.div style={{textAlign:'center'}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.4}}>
        <p style={{fontFamily:"'Cinzel',serif",fontSize:'.52rem',letterSpacing:'.38em',color:pct>60?'var(--brass2)':'var(--brass)',textTransform:'uppercase',marginBottom:'.8rem',transition:'color .8s'}}>Soul of Symphony</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2rem,4vw,3.2rem)',fontWeight:300,lineHeight:1.1,color:pct>60?'var(--ivory)':'var(--ebony)',transition:'color .8s'}}>
          The Piano Conservatoire
        </p>
      </motion.div>
      <div style={{width:'260px',height:'1px',background:pct>60?'rgba(255,255,255,.15)':'rgba(13,12,10,.12)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,height:'100%',background:'var(--felt)',width:pct+'%',transition:'width .1s linear'}}/>
      </div>
      <p style={{fontFamily:"'Cinzel',serif",fontSize:'.48rem',letterSpacing:'.24em',color:pct>60?'rgba(247,244,237,.35)':'rgba(13,12,10,.3)',textTransform:'uppercase',transition:'color .8s'}}>
        {pct<100?`${pct}%`:'Welcome'}
      </p>
    </motion.div>
  )
}

/* ══════════════════════════
   NAV — Ayana clean style
══════════════════════════ */
function Nav(){
  const [sc,setSc]=useState(false),[open,setOpen]=useState(false)
  useEffect(()=>{const f=()=>setSc(window.scrollY>50);window.addEventListener('scroll',f,{passive:true});return()=>window.removeEventListener('scroll',f)},[])
  useEffect(()=>{document.body.classList.toggle('locked',open)},[open])
  const links=[{l:'About',h:'#founder'},{l:'Courses',h:'#courses'},{l:'Faculty',h:'#team'},{l:'Reels',h:'#reels'},{l:'FAQ',h:'#faq'}]
  return(
    <>
      <style>{`
        nav{position:fixed;top:0;left:0;right:0;z-index:800;padding:1.8rem 5rem;display:flex;align-items:center;justify-content:space-between;transition:all .5s var(--ease)}
        nav.sc{background:rgba(247,244,237,.96);backdrop-filter:blur(20px);padding:1.1rem 5rem;border-bottom:1px solid var(--bd)}
        .nlo{line-height:1.2}
        .nlt{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.32em;color:var(--brass);text-transform:uppercase}
        .nlb{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:400;color:var(--ebony);letter-spacing:.03em}
        .nls{display:flex;gap:3rem;list-style:none}
        .nls a{font-family:'Cinzel',serif;font-size:.54rem;letter-spacing:.18em;color:var(--t2);text-transform:uppercase;transition:color .3s;position:relative;padding-bottom:.2rem}
        .nls a::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--felt);transition:width .4s var(--ease)}
        .nls a:hover{color:var(--ebony)}.nls a:hover::after{width:100%}
        .nbt{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ivory);background:var(--ebony);padding:.72rem 1.8rem;transition:all .35s var(--ease)}
        .nbt:hover{background:var(--felt);transform:translateY(-2px)}
        .hm{display:none;flex-direction:column;gap:5px;padding:6px;z-index:900}
        .hl{display:block;width:22px;height:1.5px;background:var(--ebony);transition:all .4s var(--ease);transform-origin:center}
        .hm.op .hl:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
        .hm.op .hl:nth-child(2){opacity:0;transform:scaleX(0)}
        .hm.op .hl:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
        .drw{position:fixed;inset:0;z-index:790;background:var(--ebony);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem}
        .dl{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,7vw,3.6rem);font-weight:300;color:rgba(247,244,237,.45);padding:.4rem 0;text-align:center;width:100%;display:block;transition:color .35s;letter-spacing:.02em}
        .dl:hover{color:var(--brass2)}
        .dbt{margin-top:2rem;font-family:'Cinzel',serif;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ebony);background:var(--brass2);padding:1rem 3rem;transition:all .35s}
        .dbt:hover{background:var(--brass3)}
        .dso{display:flex;gap:2rem;margin-top:1.8rem}
        .dso a{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.18em;color:rgba(247,244,237,.3);text-transform:uppercase;transition:color .3s}
        .dso a:hover{color:var(--brass2)}
        @media(max-width:1100px){nav{padding:1.1rem 1.8rem}nav.sc{padding:.9rem 1.8rem}.nls,.nbt{display:none}.hm{display:flex}}
        @media(max-width:640px){nav{padding:1rem 1.25rem}.nlb{font-size:1.05rem}}
      `}</style>
      <motion.nav className={sc?'sc':''} initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:EZ}}>
        <a href="#" className="nlo"><div className="nlt">Est. 2005 · Jaipur</div><div className="nlb">Soul of Symphony</div></a>
        <ul className="nls">{links.map(l=><li key={l.h}><a href={l.h}>{l.l}</a></li>)}</ul>
        <a href="#cta" className="nbt">Enrol Now</a>
        <button className={`hm${open?' op':''}`} onClick={()=>setOpen(v=>!v)} aria-label="Menu">
          <span className="hl"/><span className="hl"/><span className="hl"/>
        </button>
      </motion.nav>
      <AnimatePresence>
        {open&&(
          <motion.div className="drw"
            initial={{clipPath:'circle(0% at calc(100% - 2.5rem) 2.5rem)'}}
            animate={{clipPath:'circle(150% at calc(100% - 2.5rem) 2.5rem)',transition:{duration:.55,ease:EZ}}}
            exit={{clipPath:'circle(0% at calc(100% - 2.5rem) 2.5rem)',transition:{duration:.4,ease:[.84,0,.7,0]}}}>
            {links.map((l,i)=>(
              <motion.a key={l.h} href={l.h} className="dl" onClick={()=>setOpen(false)}
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.4,delay:.08+i*.06,ease:EZ}}>{l.l}</motion.a>
            ))}
            <motion.a href="#cta" className="dbt" onClick={()=>setOpen(false)} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.38}}>Enrol Now</motion.a>
            <motion.div className="dso" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.48}}>
              <a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.youtube.com/@soulofsymphony" target="_blank" rel="noreferrer">YouTube</a>
              <a href="mailto:soulofsymphony@gmail.com">Email</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ══════════════════════════
   HERO — Ayana editorial style
   Large word-reveal + split layout
══════════════════════════ */
function Hero(){
  const words1=['Where','Passion']
  const words2=['Becomes','Mastery.']
  const stats=[{n:20,s:'+',l:'Years'},{n:500,s:'+',l:'Students'},{n:8,s:'',l:'Grades'},{n:100,s:'%',l:'Pass Rate'}]
  return(
    <>
      <style>{`
        #hero{min-height:100vh;background:var(--ivory);position:relative;overflow:hidden;display:flex;align-items:center}
        .hgrain{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.022'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
        .hbig{position:absolute;bottom:-4%;right:-3%;font-family:'Cormorant Garamond',serif;font-size:clamp(14rem,22vw,28rem);font-weight:300;line-height:.9;color:rgba(13,12,10,.03);pointer-events:none;user-select:none;letter-spacing:-.02em}
        .hi{position:relative;z-index:2;max-width:1400px;margin:0 auto;width:100%;padding:0 5rem;display:grid;grid-template-columns:1.1fr 1fr;gap:4rem;align-items:center;min-height:100vh}
        .hleft{padding:9rem 0 5rem}
        .htag{display:flex;align-items:center;gap:.9rem;margin-bottom:2.4rem}
        .htag-line{width:36px;height:1px;background:var(--felt);flex-shrink:0}
        .htag-txt{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.32em;color:var(--felt);text-transform:uppercase}
        .hwords{margin-bottom:2.2rem}
        .hrow{display:flex;gap:.35em;flex-wrap:nowrap;overflow:hidden;line-height:1.08}
        .hw{display:block;font-family:'Cormorant Garamond',serif;font-size:clamp(3.5rem,6.5vw,8.5rem);font-weight:300;color:var(--ebony)}
        .hw.gold{color:var(--brass)}
        .hw.felt{color:var(--felt)}
        .hrow-wrap{overflow:hidden}
        .hsub{font-family:'Inter',sans-serif;font-size:clamp(.82rem,1.2vw,.92rem);line-height:2.05;color:var(--t2);max-width:460px;margin-bottom:3rem;font-weight:300;letter-spacing:.01em}
        .hbts{display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap}
        .bs{display:inline-flex;align-items:center;gap:.6rem;font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ivory);background:var(--ebony);padding:1.05rem 2.2rem;transition:all .4s var(--ease)}
        .bs:hover{background:var(--felt);transform:translateY(-3px);box-shadow:0 12px 36px rgba(139,30,50,.2)}
        .bl{display:inline-flex;align-items:center;gap:.6rem;font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.2em;text-transform:uppercase;color:var(--t2);border:1px solid var(--bd2);padding:1.05rem 2.2rem;transition:all .4s}
        .bl:hover{color:var(--ebony);border-color:var(--ebony);transform:translateY(-3px)}
        .hstats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--bd);margin-top:3.5rem;padding-top:2.5rem}
        .hstat{text-align:center;padding:.5rem;border-right:1px solid var(--bd)}
        .hstat:last-child{border-right:none}
        .hsn{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,3.2vw,3rem);font-weight:300;color:var(--ebony);line-height:1}
        .hsl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.18em;color:var(--t3);text-transform:uppercase;margin-top:.3rem}

        .hright{position:relative;display:flex;justify-content:flex-end;align-items:center;padding:7rem 0}
        .himg-w{position:relative;width:100%;max-width:440px}
        .himg-frame{position:absolute;top:-1.2rem;left:-1.2rem;right:1.2rem;bottom:1.2rem;border:1px solid var(--bd2);pointer-events:none;z-index:-1;transition:all .6s var(--ease)}
        .himg-w:hover .himg-frame{top:-1.8rem;left:-1.8rem;right:1.8rem;bottom:1.8rem}
        .himg-w img{width:100%;display:block;filter:sepia(8%) contrast(1.05);transition:transform .9s var(--ease)}
        .himg-w:hover img{transform:scale(1.03)}
        .hcard{position:absolute;bottom:-2rem;left:-1.5rem;z-index:5;background:var(--ebony);padding:1.4rem 1.8rem;min-width:220px}
        .hcl{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.22em;color:var(--brass2);text-transform:uppercase;margin-bottom:.3rem}
        .hcn{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:400;color:var(--ivory);line-height:1.2}
        .hcr{font-size:.68rem;color:rgba(247,244,237,.4);margin-top:.15rem;letter-spacing:.01em}
        .hsc{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.5rem;opacity:.3}
        .hsc span{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.28em;color:var(--ebony);text-transform:uppercase}
        .hscl{width:1px;height:40px;background:linear-gradient(var(--ebony),transparent);animation:drip 2s ease-in-out infinite}
        @keyframes drip{0%,100%{opacity:.3;transform:scaleY(.8)}50%{opacity:1;transform:scaleY(1.15)}}
        @media(max-width:1100px){.hi{grid-template-columns:1fr;padding:0 2.5rem}.hright{display:none}.hleft{padding:8rem 0 4rem}.hstats{grid-template-columns:repeat(2,1fr)}.hstat:nth-child(2){border-right:none}.hstat:nth-child(3){border-top:1px solid var(--bd)}.hstat:nth-child(4){border-top:1px solid var(--bd)}.hsc{display:none}}
        @media(max-width:640px){.hi{padding:0 1.25rem}.hleft{padding:7rem 0 3rem}.hbts{flex-direction:column;align-items:stretch}.bs,.bl{text-align:center;justify-content:center}}
      `}</style>
      <section id="hero">
        <div className="hgrain"/>
        <div className="hbig">♩</div>
        <div className="hi">
          <div className="hleft">
            <motion.div className="htag" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{duration:.8,ease:EZ}}>
              <div className="htag-line"/>
              <span className="htag-txt">The Piano Conservatoire · Jaipur</span>
            </motion.div>
            <div className="hwords">
              <div className="hrow">
                {words1.map((w,i)=>(
                  <div key={i} className="hrow-wrap">
                    <motion.span className="hw" initial={{y:'105%'}} animate={{y:'0%'}} transition={{duration:.8,delay:.3+i*.15,ease:EZ}}>{w}</motion.span>
                  </div>
                ))}
              </div>
              <div className="hrow">
                {words2.map((w,i)=>(
                  <div key={i} className="hrow-wrap">
                    <motion.span className={`hw${i===0?' gold':' felt'}`} initial={{y:'105%'}} animate={{y:'0%'}} transition={{duration:.8,delay:.7+i*.15,ease:EZ}}>{w}</motion.span>
                  </div>
                ))}
              </div>
            </div>
            <motion.p className="hsub" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.95,ease:EZ}}>
              North India's premier piano-exclusive conservatoire. Two decades of shaping performers, educators and artists — by the pianist who redefined the craft in Rajasthan.
            </motion.p>
            <motion.div className="hbts" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:1.1,ease:EZ}}>
              <a href="#cta" className="bs">Reserve Your Seat →</a>
              <a href="#courses" className="bl">View Courses</a>
            </motion.div>
            <motion.div className="hstats" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:1.25,ease:EZ}}>
              {stats.map((s,i)=><StatNum key={i} end={s.n} suffix={s.s} label={s.l}/>)}
            </motion.div>
          </div>
          <motion.div className="hright" initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} transition={{duration:1.1,delay:.5,ease:EZ}}>
            <div className="himg-w">
              <div className="himg-frame"/>
              <img src="https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-819x1024.png"
                alt="Pradeep Chaturvedi" loading="eager"
                onError={e=>{e.target.style.display='none';e.target.parentElement.style.minHeight='500px';e.target.parentElement.style.background='var(--parchment)'}}/>
              <motion.div className="hcard" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:1.4,ease:EZ}}>
                <div className="hcl">Founder & Director</div>
                <div className="hcn">Pradeep Chaturvedi</div>
                <div className="hcr">Pianist · Trinity College London</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="hsc" aria-hidden="true"><span>Scroll</span><div className="hscl"/></div>
      </section>
    </>
  )
}

function StatNum({end,suffix,label}){
  const ref=useRef(null),inView=useInView(ref,{once:true,amount:.5})
  const [c,setC]=useState(0)
  useEffect(()=>{if(!inView)return;let v=0;const s=end/55;const t=setInterval(()=>{v=Math.min(v+s,end);setC(Math.round(v));if(v>=end)clearInterval(t)},20);return()=>clearInterval(t)},[inView,end])
  return(
    <div ref={ref} className="hstat">
      <div className="hsn">{c}{suffix}</div>
      <div className="hsl">{label}</div>
    </div>
  )
}

/* ══════════════════════════
   MARQUEE BAND — ebony with ivory text
══════════════════════════ */
function Band(){
  const items=['Trinity College London','Rock & Pop Examinations','Alfred Music USA','Music for Little Mozarts','Pioneer of Western Piano · Rajasthan','20+ Years of Musical Excellence']
  return(
    <>
      <style>{`
        .band{background:var(--ebony);padding:.92rem 0;overflow:hidden}
        .btrk{display:inline-flex;white-space:nowrap;animation:mq 38s linear infinite}
        .btrk:hover{animation-play-state:paused}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .bi{font-family:'Cinzel',serif;font-size:.54rem;letter-spacing:.24em;color:rgba(247,244,237,.7);text-transform:uppercase;padding:0 2rem}
        .bs2{color:var(--brass2);padding:0 .5rem;font-size:.6rem}
      `}</style>
      <div className="band" aria-hidden="true">
        <div className="btrk">
          {[...items,...items,...items,...items].map((t,i)=><span key={i}><span className="bi">{t}</span><span className="bs2">◆</span></span>)}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════
   FOUNDER — Ayana about-style 
   magazine editorial two-col
══════════════════════════ */
function Founder(){
  return(
    <>
      <style>{`
        #founder{background:var(--cream);padding:10rem 0;position:relative}
        #founder::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .fg{max-width:1400px;margin:0 auto;padding:0 5rem;display:grid;grid-template-columns:1fr 1fr;gap:8rem;align-items:start}
        .fi{position:relative;top:0}
        .fi-num{font-family:'Cinzel',serif;font-size:8rem;font-weight:300;color:var(--parchment);line-height:.9;margin-bottom:1rem;letter-spacing:-.02em;user-select:none}
        .fimgw{position:relative;overflow:hidden}
        .fimgw img{width:100%;display:block;filter:sepia(5%) contrast(1.06);transition:transform .9s var(--ease)}
        .fimgw:hover img{transform:scale(1.03)}
        .fimgw::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,12,10,.6) 0%,transparent 50%)}
        .fq{position:absolute;bottom:0;left:0;right:0;padding:2rem;z-index:2}
        .fq p{font-family:'Cormorant Garamond',serif;font-size:1.08rem;font-style:italic;color:var(--ivory);line-height:1.75;margin-bottom:.4rem}
        .fq cite{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.18em;color:var(--brass2);text-transform:uppercase;font-style:normal}
        .ft-sec{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:var(--felt);display:flex;align-items:center;gap:.8rem;margin-bottom:1.4rem}
        .ft-sec::before{content:'';display:block;width:24px;height:1px;background:var(--felt);flex-shrink:0}
        .fh2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,4.5vw,5.2rem);font-weight:300;line-height:1.06;color:var(--ebony);margin-bottom:.8rem}
        .fh2 span{color:var(--brass)}
        .frole{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.2em;color:var(--brass);text-transform:uppercase;margin-bottom:2rem}
        .fp{font-family:'Inter',sans-serif;font-size:clamp(.82rem,1.2vw,.9rem);line-height:2.1;color:var(--t2);margin-bottom:1rem;letter-spacing:.01em}
        .fline{height:1px;background:var(--bd);margin:2rem 0}
        .fbadges{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2rem}
        .fbadge{font-family:'Cinzel',serif;font-size:.46rem;letter-spacing:.12em;text-transform:uppercase;color:var(--t2);border:1px solid var(--bd2);padding:.45rem .9rem;transition:all .35s var(--ease)}
        .fbadge:hover{color:var(--felt);border-color:var(--felt);background:rgba(139,30,50,.05);transform:translateY(-2px)}
        @media(max-width:1100px){.fg{grid-template-columns:1fr;gap:4rem;padding:0 2.5rem}.fi-num{font-size:5rem}}
        @media(max-width:640px){.fg{padding:0 1.25rem}#founder{padding:6rem 0}}
      `}</style>
      <section id="founder">
        <div className="fg">
          <motion.div className="fi" {...rv(0,50)}>
            <div className="fi-num">01</div>
            <div className="fimgw">
              <img src="https://soulofsymphony.wellthrivelimited.com/wp-content/uploads/2026/02/sir-1-1024x1024.png"
                alt="Pradeep Chaturvedi" loading="lazy"
                onError={e=>{e.target.parentElement.style.minHeight='480px';e.target.parentElement.style.background='var(--parchment)';e.target.style.display='none'}}/>
              <div className="fq">
                <p>"Music is not a pastime. It is a discipline, a language, a life."</p>
                <cite>— Pradeep Chaturvedi</cite>
              </div>
            </div>
          </motion.div>
          <div>
            <motion.p className="ft-sec" {...rv(.1,20,.7)}>The Maestro</motion.p>
            <motion.h2 className="fh2" {...rv(.15,40)}>Pradeep<br/><span>Chaturvedi</span></motion.h2>
            <motion.p className="frole" {...rv(.2,20,.7)}>Pianist · Educator · Trinity College London</motion.p>
            {['Widely acknowledged as the pioneer of Western classical piano education in Rajasthan, Pradeep Chaturvedi has spent over two decades building the most respected piano conservatoire in North India.',
              'As the authorised regional representative of Trinity College London, he holds the unique distinction of conducting internationally recognised graded examinations in Jaipur.',
              'His students have achieved national ranks, performed at international stages, and gained admission to premier music institutions across three continents.',
            ].map((p,i)=><motion.p key={i} className="fp" {...rv(.25+i*.1,20,.8)}>{p}</motion.p>)}
            <motion.div className="fline" {...rh(.55)}/>
            <motion.div className="fbadges" {...rv(.6,16,.8)}>
              {['Trinity Affiliate','Rock & Pop','Alfred Method','20+ Years','North India Pioneer'].map(b=><span key={b} className="fbadge">{b}</span>)}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   ENDORSEMENTS
══════════════════════════ */
function Endorsements(){
  return(
    <>
      <style>{`
        #endorse{background:var(--ebony);padding:9rem 0;position:relative;overflow:hidden}
        #endorse::before{content:'♫';position:absolute;right:2%;top:5%;font-family:'Cormorant Garamond',serif;font-size:20rem;line-height:1;color:rgba(255,255,255,.02);pointer-events:none;user-select:none}
        .en{max-width:1400px;margin:0 auto;padding:0 5rem}
        .ent{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:var(--brass2);display:flex;align-items:center;gap:.8rem;margin-bottom:1.2rem}
        .ent::before{content:'';display:block;width:24px;height:1px;background:var(--brass2);flex-shrink:0}
        .enh2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,4vw,4.5rem);font-weight:300;line-height:1.08;color:var(--ivory);margin-bottom:1rem}
        .enh2 em{color:var(--brass2);font-style:italic}
        .eng{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:3.5rem}
        .enc{border:1px solid rgba(247,244,237,.08);padding:3rem;position:relative;overflow:hidden;transition:all .4s var(--ease)}
        .enc::before{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--brass2);transition:height .5s var(--ease)}
        .enc:hover{border-color:rgba(247,244,237,.16);transform:translateY(-6px);background:rgba(255,255,255,.03)}
        .enc:hover::before{height:100%}
        .ecd{display:flex;align-items:center;gap:1.2rem;margin-bottom:1.6rem}
        .eci{width:50px;height:50px;border:1px solid rgba(247,244,237,.15);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--brass2);flex-shrink:0;transition:all .35s}
        .enc:hover .eci{background:rgba(184,125,42,.12);border-color:var(--brass2)}
        .ecn{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:400;color:var(--ivory)}
        .ecr{font-family:'Cinzel',serif;font-size:.45rem;letter-spacing:.16em;color:var(--brass2);text-transform:uppercase;margin-top:.18rem}
        .ect{font-family:'Inter',sans-serif;font-size:clamp(.8rem,1.1vw,.84rem);color:rgba(247,244,237,.5);line-height:2;letter-spacing:.01em}
        @media(max-width:1100px){.en{padding:0 2.5rem}}
        @media(max-width:640px){.en{padding:0 1.25rem}#endorse{padding:6rem 0}.eng{grid-template-columns:1fr}.enc{padding:2rem}}
      `}</style>
      <section id="endorse">
        <div className="en">
          <motion.p className="ent" {...rv(0,16,.7)}>Endorsed By</motion.p>
          <motion.h2 className="enh2" {...rv(.1,40)}>When India's Greatest <em>Voices</em><br/>Speak of One School.</motion.h2>
          <div className="eng">
            {[{ico:'♩',n:'Gajendra Verma',r:'Playback Singer · Composer',t:"India's chart-topping Hindi singer endorses Soul of Symphony as one of the nation's finest piano institutions — praising its conservatoire-grade discipline and transformative approach."},
              {ico:'♪',n:'Ravindra Upadhyay',r:'Playback Singer · Music Director',t:'Ravindra Upadhyay personally attests to the rigour, artistry and musical culture cultivated here — noting its pivotal role in shaping professional musicians across North India.'}
            ].map((e,i)=>(
              <motion.div key={i} className="enc" {...rv(.2+i*.12,40)}>
                <div className="ecd"><div className="eci">{e.ico}</div><div><div className="ecn">{e.n}</div><div className="ecr">{e.r}</div></div></div>
                <div className="ect">{e.t}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   ALUMNI TICKER
══════════════════════════ */
function AlumniTicker(){
  const items=[...ALUMNI,...ALUMNI]
  return(
    <>
      <style>{`
        .altb{background:var(--parchment);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:1.05rem 0;overflow:hidden}
        .altr{display:inline-flex;white-space:nowrap;animation:mq2 52s linear infinite}
        .altr:hover{animation-play-state:paused}
        @keyframes mq2{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ali{font-family:'Cormorant Garamond',serif;font-size:clamp(.88rem,1.3vw,1.05rem);font-style:italic;color:var(--t2);padding:0 2.2rem}
        .alsep{color:var(--brass);opacity:.6;font-size:.7rem;padding:0 .2rem}
      `}</style>
      <div className="altb" aria-label="Notable alumni">
        <div className="altr">{items.map((a,i)=><span key={i}><span className="ali">{a}</span><span className="alsep"> ◆ </span></span>)}</div>
      </div>
    </>
  )
}

/* ══════════════════════════
   COURSES — Ayana numbered cards
   Clean ivory + ebony + brass accent
══════════════════════════ */
function CourseCard({c,i}){
  const [hov,setHov]=useState(false)
  return(
    <motion.div style={{
      position:'relative',borderTop:`1px solid ${hov?'var(--felt)':'var(--bd2)'}`,
      padding:'2.2rem 2rem',background:hov?'var(--ebony)':'transparent',
      transition:'all .45s var(--ease)',cursor:'pointer',overflow:'hidden',
    }} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      data-cur={c.hot?'Premier':'Explore'} {...rv(.12+i*.08,30)}>
      {c.hot&&<div style={{position:'absolute',top:0,right:0,fontFamily:"'Cinzel',serif",fontSize:'.42rem',letterSpacing:'.16em',color:'var(--ivory)',background:'var(--felt)',padding:'.3rem .85rem',textTransform:'uppercase',zIndex:2}}>Most Popular</div>}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:'.48rem',letterSpacing:'.22em',color:hov?'rgba(247,244,237,.3)':'var(--t3)',textTransform:'uppercase',transition:'color .35s'}}>{c.num}</span>
        <span style={{fontFamily:"'Cinzel',serif",fontSize:'.46rem',letterSpacing:'.14em',color:hov?'var(--brass2)':'var(--brass)',textTransform:'uppercase',border:`1px solid ${hov?'rgba(212,160,66,.4)':'rgba(184,125,42,.3)'}`,padding:'.28rem .7rem',transition:'all .35s'}}>{c.tag}</span>
      </div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(1.45rem,2.2vw,1.8rem)',fontWeight:300,color:hov?'var(--ivory)':'var(--ebony)',lineHeight:1.2,marginBottom:'.3rem',transition:'color .35s'}}>{c.tier}</div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:'.46rem',letterSpacing:'.16em',textTransform:'uppercase',color:hov?'rgba(247,244,237,.38)':'var(--t3)',marginBottom:'.35rem',transition:'color .35s'}}>{c.grades}</div>
      <div style={{fontSize:'.72rem',color:hov?'rgba(247,244,237,.35)':'var(--t3)',marginBottom:'1.5rem',letterSpacing:'.01em',transition:'color .35s'}}>{c.age}</div>
      <div style={{height:'1px',background:hov?'rgba(247,244,237,.08)':'var(--bd)',marginBottom:'1.2rem',transition:'background .35s'}}/>
      <ul style={{listStyle:'none'}}>
        {c.feat.map(f=><li key={f} style={{fontSize:'.76rem',color:hov?'rgba(247,244,237,.5)':'var(--t2)',padding:'.28rem 0',display:'flex',gap:'.6rem',letterSpacing:'.01em',transition:'color .35s'}}>
          <span style={{color:hov?'var(--brass2)':'var(--brass)',flexShrink:0,fontSize:'.7rem'}}>—</span>{f}
        </li>)}
      </ul>
      <div style={{display:'flex',alignItems:'baseline',gap:'.4rem',marginTop:'1.5rem',paddingTop:'1.2rem',borderTop:`1px solid ${hov?'rgba(247,244,237,.08)':'var(--bd)'}`,transition:'border-color .35s'}}>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.8rem',fontWeight:300,color:hov?'var(--brass3)':'var(--brass)',transition:'color .35s'}}>{c.price}</span>
        <span style={{fontSize:'.7rem',color:hov?'rgba(247,244,237,.3)':'var(--t3)',transition:'color .35s'}}>/class</span>
      </div>
    </motion.div>
  )
}

function Courses(){
  return(
    <>
      <style>{`
        #courses{background:var(--ivory);padding:10rem 0;position:relative}
        #courses::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .co{max-width:1400px;margin:0 auto;padding:0 5rem}
        .coh{margin-bottom:4rem;display:grid;grid-template-columns:1.1fr 1fr;gap:4rem;align-items:end}
        .cot{font-family:'Cinzel',serif;font-size:.5rem;letterSpacing:'.3em';text-transform:uppercase;color:var(--felt);display:flex;align-items:center;gap:.8rem;margin-bottom:1.2rem}
        .cot::before{content:'';display:block;width:22px;height:1px;background:var(--felt);flex-shrink:0}
        .coh h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,4vw,4.8rem);font-weight:300;color:var(--ebony);line-height:1.06}
        .coh h2 em{color:var(--brass);font-style:italic}
        .cohp{font-family:'Inter',sans-serif;font-size:clamp(.82rem,1.1vw,.88rem);color:var(--t2);line-height:2;letter-spacing:.01em}
        .cgrd{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--bd);border-right:none}
        .cgrd>*{border-right:1px solid var(--bd)}
        @media(max-width:1100px){.co{padding:0 2.5rem}.cgrd{grid-template-columns:repeat(2,1fr)}.coh{grid-template-columns:1fr;gap:1.5rem}}
        @media(max-width:640px){.co{padding:0 1.25rem}#courses{padding:6rem 0}.cgrd{grid-template-columns:1fr}.coh h2{font-size:2.4rem}}
      `}</style>
      <section id="courses">
        <div className="co">
          <div className="coh">
            <div>
              <motion.p className="cot" {...rv(0,16,.7)}>The Curriculum</motion.p>
              <motion.h2 {...rv(.1,36)}>A Path for Every <em>Aspiration.</em></motion.h2>
            </div>
            <motion.p className="cohp" {...rv(.15,20,.8)}>Every programme is structured around the Trinity College London graded syllabus — international standards, delivered with the care of a family institution.</motion.p>
          </div>
          <div className="cgrd">{COURSES.map((c,i)=><CourseCard key={i} c={c} i={i}/>)}</div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   PIANO KEYS divider — ivory + ebony
══════════════════════════ */
function PianoKeys(){
  const [hov,setHov]=useState(null)
  const pat=[true,true,false,true,true,true,false]
  const wkeys=[]
  let idx=0
  for(let o=0;o<3;o++){
    pat.forEach(hasBlack=>{
      const wi=idx++
      wkeys.push(
        <div key={'w'+wi} style={{width:'36px',height:'120px',border:'1px solid rgba(0,0,0,.15)',borderTop:'none',flexShrink:0,position:'relative',cursor:'pointer',
          background:hov===('w'+wi)?'linear-gradient(180deg,var(--brass3),var(--brass2))':'linear-gradient(180deg,#FAF7F0,#E8E2D5)',
          boxShadow:hov===('w'+wi)?'0 4px 20px rgba(184,125,42,.4)':'none',
          transition:'background .2s,box-shadow .2s'}}
          onMouseEnter={()=>setHov('w'+wi)} onMouseLeave={()=>setHov(null)}>
          {hasBlack&&<div style={{width:'23px',height:'72px',position:'absolute',top:0,right:'-11.5px',zIndex:3,borderRadius:'0 0 4px 4px',cursor:'pointer',
            background:hov===('b'+wi)?'linear-gradient(180deg,#6B1E32,var(--felt))':'var(--ebony)',
            boxShadow:hov===('b'+wi)?'0 4px 20px rgba(139,30,50,.5)':'none',
            transition:'background .18s,box-shadow .18s'}}
            onMouseEnter={e=>{e.stopPropagation();setHov('b'+wi)}} onMouseLeave={()=>setHov(null)}/>}
        </div>
      )
    })
  }
  return(
    <div style={{background:'var(--ebony2)',padding:'3.5rem 0',display:'flex',justifyContent:'center',
      borderTop:'1px solid rgba(255,255,255,.05)',borderBottom:'1px solid rgba(255,255,255,.05)'}} aria-hidden="true">
      <div style={{display:'flex',position:'relative',height:'120px',boxShadow:'0 16px 60px rgba(0,0,0,.5)'}}>{wkeys}</div>
    </div>
  )
}

/* ══════════════════════════
   TEAM — Ayana portrait cards
   Each card has a subtle felt/brass accent
══════════════════════════ */
function Team(){
  const accents=['var(--brass)','var(--felt)','var(--silk)']
  return(
    <>
      <style>{`
        #team{background:var(--cream);padding:10rem 0;position:relative}
        #team::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .te{max-width:1400px;margin:0 auto;padding:0 5rem}
        .teg{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:3.5rem}
        .tec{position:relative;overflow:hidden;background:var(--ivory);border:1px solid var(--bd);transition:all .45s var(--ease)}
        .tec:hover{transform:translateY(-10px);box-shadow:0 28px 72px rgba(13,12,10,.12)}
        .tei{aspect-ratio:3/4;overflow:hidden;position:relative}
        .tei img{width:100%;height:100%;object-fit:cover;filter:sepia(5%) contrast(1.06);transition:transform .8s var(--ease)}
        .tec:hover .tei img{transform:scale(1.06)}
        .tei::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,12,10,.7) 0%,rgba(13,12,10,.05) 55%,transparent 100%)}
        .tein{position:absolute;bottom:0;left:0;right:0;padding:1.8rem;z-index:2}
        .tetag{font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.16em;text-transform:uppercase;margin-bottom:.4rem;display:flex;align-items:center;gap:.5rem}
        .tetag::before{content:'';display:block;width:12px;height:1px;background:currentColor;flex-shrink:0}
        .ten{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:400;color:var(--ivory);line-height:1.2}
        .ter{font-size:.7rem;color:rgba(247,244,237,.45);margin-top:.18rem;letter-spacing:.02em}
        .teho{position:absolute;inset:0;background:var(--ebony);display:flex;align-items:center;justify-content:center;padding:2.5rem;opacity:0;transform:translateY(14px);transition:opacity .4s var(--ease),transform .4s var(--ease);z-index:3}
        .tec:hover .teho{opacity:1;transform:translateY(0)}
        .teq{font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,1.5vw,1.25rem);font-style:italic;color:var(--ivory);line-height:1.75;margin-bottom:1.2rem;text-align:center}
        .teqn{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.2em;text-transform:uppercase;text-align:center}
        @media(max-width:1100px){.te{padding:0 2.5rem}.teg{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:640px){.te{padding:0 1.25rem}#team{padding:6rem 0}.teg{grid-template-columns:1fr}.tei{aspect-ratio:16/9}}
      `}</style>
      <section id="team">
        <div className="te">
          <motion.p style={{fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--felt)',display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1.2rem'}} {...rv(0,16,.7)}>
            <span style={{display:'block',width:'24px',height:'1px',background:'var(--felt)',flexShrink:0}}/>The Faculty
          </motion.p>
          <motion.h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2.4rem,4vw,4.5rem)',fontWeight:300,lineHeight:1.06,color:'var(--ebony)'}} {...rv(.1,36)}>
            Taught by Masters.<br/><span style={{color:'var(--brass)',fontStyle:'italic'}}>Mentored with Heart.</span>
          </motion.h2>
          <div className="teg">
            {TEAM.map((m,i)=>(
              <motion.div key={i} className="tec" data-cur="View" {...rv(.15+i*.12,50)}>
                <div className="tei">
                  <img src={m.img} alt={m.name} loading="lazy" onError={e=>{e.target.style.display='none'}}/>
                </div>
                <div className="tein">
                  <div className="tetag" style={{color:accents[i]}}>{m.tag}</div>
                  <div className="ten">{m.name}</div>
                  <div className="ter">{m.role}</div>
                </div>
                <div className="teho">
                  <div>
                    <div className="teq">"{m.quote}"</div>
                    <div className="teqn" style={{color:accents[i]}}>{m.name}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   REELS — clean ivory cards
══════════════════════════ */
function ReelCard({r,i}){
  const [playing,setPlaying]=useState(false),[err,setErr]=useState(false)
  const vid=useRef(null)
  const toggle=()=>{if(!vid.current||err)return;if(vid.current.paused){vid.current.play();setPlaying(true)}else{vid.current.pause();setPlaying(false)}}
  return(
    <motion.div style={{position:'relative',overflow:'hidden',aspectRatio:'9/16',background:'var(--parchment)',
      border:'1px solid var(--bd)',cursor:'pointer',transition:'all .45s var(--ease)'}}
      whileHover={{scale:1.025,y:-5,borderColor:'var(--bd2)',boxShadow:'0 24px 64px rgba(13,12,10,.14)'}}
      onClick={toggle} data-cur={playing?'Pause':'Play'} {...rv(.12+i*.1,50)}>
      {err
        ?<div style={{width:'100%',height:'100%',background:'var(--parchment)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--t3)',fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.18em',textTransform:'uppercase'}}>No Preview</div>
        :<video ref={vid} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',pointerEvents:'none'}}
          autoPlay muted loop playsInline preload="metadata" src={r.src} onError={()=>setErr(true)}/>
      }
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(13,12,10,.88) 0%,rgba(13,12,10,.08) 55%,transparent 100%)'}}/>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        width:'50px',height:'50px',border:`1px solid ${playing?'var(--felt)':'rgba(247,244,237,.5)'}`,
        display:'flex',alignItems:'center',justifyContent:'center',
        background:playing?'var(--felt)':'rgba(13,12,10,.25)',backdropFilter:'blur(6px)',
        borderRadius:'50%',transition:'all .35s var(--ease)'}}>
        <span style={{fontSize:playing?'.6rem':'.75rem',color:'var(--ivory)',marginLeft:playing?0:'2px'}}>{playing?'❚❚':'▶'}</span>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'1.3rem 1.1rem',zIndex:2}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:'.44rem',letterSpacing:'.18em',color:'var(--brass2)',textTransform:'uppercase',marginBottom:'.4rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
          <span style={{display:'block',width:'12px',height:'1px',background:'var(--brass2)',flexShrink:0}}/>{r.tag}
        </div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'.95rem',fontStyle:'italic',color:'var(--ivory)',lineHeight:1.45,fontWeight:300}}>{r.title}</div>
      </div>
    </motion.div>
  )
}

function Instagram(){
  return(
    <>
      <style>{`
        #reels{background:var(--ebony);padding:10rem 0;position:relative;overflow:hidden}
        #reels::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:rgba(247,244,237,.07)}
        .ri{max-width:1400px;margin:0 auto;padding:0 5rem;position:relative;z-index:1}
        .rih{display:grid;grid-template-columns:1fr auto;align-items:flex-end;margin-bottom:3.5rem;gap:2rem}
        .rih h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,4vw,4.5rem);font-weight:300;color:var(--ivory);line-height:1.06}
        .rih h2 em{color:var(--brass2);font-style:italic}
        .rih p{font-size:clamp(.82rem,1.1vw,.88rem);color:rgba(247,244,237,.45);line-height:2;max-width:440px;margin-top:.8rem;font-family:'Inter',sans-serif;letter-spacing:.01em}
        .rfl{display:inline-flex;align-items:center;gap:.6rem;font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ebony);background:var(--brass2);padding:.85rem 1.7rem;white-space:nowrap;transition:all .35s var(--ease);align-self:flex-start}
        .rfl:hover{background:var(--brass3);transform:translateY(-2px)}
        .rgd{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem}
        @media(max-width:1100px){.ri{padding:0 2.5rem}.rih{grid-template-columns:1fr;gap:1.5rem}.rgd{grid-template-columns:repeat(2,1fr);gap:1rem}}
        @media(max-width:640px){.ri{padding:0 1.25rem}#reels{padding:6rem 0}.rgd{grid-template-columns:repeat(2,1fr);gap:.7rem}}
        @media(max-width:380px){.rgd{grid-template-columns:1fr}}
      `}</style>
      <section id="reels">
        <div className="ri">
          <div className="rih">
            <div>
              <motion.p style={{fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--brass2)',display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1.1rem'}} {...rv(0,16,.7)}>
                <span style={{display:'block',width:'22px',height:'1px',background:'var(--brass2)',flexShrink:0}}/>On Instagram
              </motion.p>
              <motion.h2 {...rv(.1,36)}>Moments of <em>Music</em>,<br/>Shared with the World.</motion.h2>
              <motion.p {...rv(.2,20,.8)}>Watch our students perform, grow and inspire. Follow <strong style={{color:'var(--brass3)'}}>@soulofsymphony</strong></motion.p>
            </div>
            <motion.a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer" className="rfl" {...rv(.25,20,.8)}>◎ Follow</motion.a>
          </div>
          <div className="rgd">{REELS.map((r,i)=><ReelCard key={i} r={r} i={i}/>)}</div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   TESTIMONIALS — clean cards
══════════════════════════ */
function Testimonials(){
  const items=[
    {text:'"Soul of Symphony transformed my understanding of music. The mentorship and discipline here are unmatched anywhere in India."',author:'Vivasvat Devanampriya'},
    {text:'"The teachers are highly skilled and genuinely patient. The curriculum is structured, deep, and truly inspiring."',author:'Siddhi Agrawal'},
    {text:'"This institute does not just teach piano — it instils life lessons, confidence and a rare sense of character."',author:'Shreya Jain'},
    {text:'"A truly professional conservatoire with international standards. My son now performs at national events."',author:'Vishal Mathur'},
  ]
  return(
    <>
      <style>{`
        #testi{background:var(--parchment);padding:10rem 0;position:relative}
        #testi::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        #testi::after{content:'\\201C';position:absolute;left:2%;top:2%;font-family:'Cormorant Garamond',serif;font-size:28rem;line-height:.85;color:rgba(13,12,10,.04);pointer-events:none;user-select:none}
        .ti{max-width:1400px;margin:0 auto;padding:0 5rem}
        .tig{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-top:4.5rem}
        .tic{background:var(--ivory);border:1px solid var(--bd);padding:2.8rem;position:relative;transition:all .4s var(--ease)}
        .tic::after{content:'';position:absolute;top:0;left:0;width:3px;height:0;background:var(--felt);transition:height .5s var(--ease)}
        .tic:hover{transform:translateY(-6px);box-shadow:0 20px 56px rgba(13,12,10,.1);border-color:var(--bd2)}
        .tic:hover::after{height:100%}
        .tistar{color:var(--brass2);font-size:.9rem;letter-spacing:.1em;margin-bottom:1.3rem}
        .titxt{font-family:'Cormorant Garamond',serif;font-size:clamp(.98rem,1.5vw,1.12rem);font-style:italic;color:var(--t1);line-height:1.9;margin-bottom:1.5rem;font-weight:400}
        .tiaut{font-family:'Cinzel',serif;font-size:.5rem;letter-spacing:.18em;color:var(--brass);text-transform:uppercase}
        @media(max-width:1100px){.ti{padding:0 2.5rem}}
        @media(max-width:640px){.ti{padding:0 1.25rem}#testi{padding:6rem 0}.tig{grid-template-columns:1fr;gap:1rem}.tic{padding:2rem}}
      `}</style>
      <section id="testi">
        <div className="ti">
          <motion.p style={{fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--felt)',display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1.1rem'}} {...rv(0,16,.7)}>
            <span style={{display:'block',width:'22px',height:'1px',background:'var(--felt)',flexShrink:0}}/>What They Say
          </motion.p>
          <motion.h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(2.4rem,4vw,4.5rem)',fontWeight:300,lineHeight:1.06,color:'var(--ebony)'}} {...rv(.1,36)}>
            Voices of <span style={{color:'var(--brass)',fontStyle:'italic'}}>Distinction.</span>
          </motion.h2>
          <div className="tig">
            {items.map((t,i)=>(
              <motion.div key={i} className="tic" {...rv(.15+i*.1,36)}>
                <div className="tistar">{'★'.repeat(5)}</div>
                <div className="titxt">{t.text}</div>
                <div className="tiaut">— {t.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   FAQ — Ayana clean accordion
══════════════════════════ */
function FAQ(){
  const [open,setOpen]=useState(null)
  return(
    <>
      <style>{`
        #faq{background:var(--ivory);padding:10rem 0;position:relative}
        #faq::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),transparent)}
        .fq{max-width:1400px;margin:0 auto;padding:0 5rem;display:grid;grid-template-columns:1fr 1.6fr;gap:8rem;align-items:start}
        .fql h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,3.8vw,4rem);font-weight:300;color:var(--ebony);line-height:1.06;margin:.5rem 0 1.2rem}
        .fql h2 em{color:var(--brass);font-style:italic}
        .fql p{font-family:'Inter',sans-serif;font-size:clamp(.82rem,1.2vw,.88rem);color:var(--t2);line-height:2;margin-bottom:1.8rem;letter-spacing:.01em}
        .fqla{font-family:'Cinzel',serif;font-size:.52rem;letter-spacing:.2em;text-transform:uppercase;color:var(--felt);border-bottom:1px solid rgba(139,30,50,.3);padding-bottom:.2rem;transition:all .3s;display:inline-block}
        .fqla:hover{letter-spacing:.28em;border-color:var(--felt)}
        .fqit{border-bottom:1px solid var(--bd);overflow:hidden}
        .fqbt{width:100%;text-align:left;background:none;padding:1.6rem 0;display:flex;justify-content:space-between;align-items:center;gap:1.2rem;font-family:'Cormorant Garamond',serif;font-size:clamp(.95rem,1.5vw,1.1rem);color:var(--ebony);line-height:1.5;cursor:pointer;transition:color .3s}
        .fqbt:hover{color:var(--felt)}
        .fqic{width:28px;height:28px;border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;color:var(--t2);font-size:.75rem;flex-shrink:0;transition:all .35s var(--ease)}
        .fqit.op .fqic{background:var(--felt);border-color:var(--felt);color:var(--ivory);transform:rotate(45deg)}
        .fqan{font-family:'Inter',sans-serif;font-size:clamp(.8rem,1.1vw,.84rem);color:var(--t2);line-height:2.1;letter-spacing:.01em;overflow:hidden}
        .fqit.op .fqan{padding-bottom:1.4rem}
        @media(max-width:1100px){.fq{grid-template-columns:1fr;gap:3.5rem;padding:0 2.5rem}}
        @media(max-width:640px){.fq{padding:0 1.25rem}#faq{padding:6rem 0}.fqbt{font-size:.9rem;padding:1.2rem 0}}
      `}</style>
      <section id="faq">
        <div className="fq">
          <div>
            <motion.p style={{fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--felt)',display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1rem'}} {...rv(0,16,.7)}>
              <span style={{display:'block',width:'22px',height:'1px',background:'var(--felt)',flexShrink:0}}/>Questions
            </motion.p>
            <motion.h2 {...rv(.1,36)}>Frequently<br/><em>Asked.</em></motion.h2>
            <motion.p {...rv(.2,20,.8)}>Not finding your answer? We are happy to speak with you personally about your musical journey.</motion.p>
            <motion.a href="#cta" className="fqla" {...rv(.25,16,.7)}>Contact Us Directly →</motion.a>
          </div>
          <motion.div {...rv(.15,36,.9)}>
            {FAQS.map((f,i)=>(
              <div key={i} className={`fqit${open===i?' op':''}`}>
                <button className="fqbt" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>
                  {f.q}<span className="fqic">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {open===i&&(
                    <motion.div className="fqan"
                      initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:.42,ease:EZ}}>{f.a}</motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   CTA + CONTACT
══════════════════════════ */
function CTA(){
  const [sent,setSent]=useState(false)
  return(
    <>
      <style>{`
        #cta{background:var(--ebony);padding:10rem 0;position:relative;overflow:hidden}
        #cta::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:rgba(247,244,237,.07)}
        .ct{max-width:1400px;margin:0 auto;padding:0 5rem;position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:start}
        .ctl h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,4.2vw,5rem);font-weight:300;color:var(--ivory);line-height:1.04;margin:.5rem 0 1.2rem}
        .ctl h2 em{color:var(--brass2);font-style:italic}
        .ctl p{font-family:'Inter',sans-serif;font-size:clamp(.82rem,1.2vw,.9rem);color:rgba(247,244,237,.5);line-height:2;margin-bottom:2.5rem;letter-spacing:.01em}
        .crows{display:flex;flex-direction:column;gap:.8rem}
        .crow{display:flex;gap:1rem;align-items:flex-start;padding:.95rem 1.2rem;border:1px solid rgba(247,244,237,.08);background:rgba(255,255,255,.02);transition:all .4s var(--ease)}
        .crow:hover{border-color:rgba(184,125,42,.3);background:rgba(184,125,42,.05);transform:translateX(7px)}
        .croi{font-size:.9rem;flex-shrink:0;margin-top:.05rem}
        .crot strong{display:block;font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.14em;color:var(--brass2);text-transform:uppercase;font-weight:500;margin-bottom:.18rem}
        .crot span{font-family:'Inter',sans-serif;font-size:clamp(.76rem,1.1vw,.82rem);color:rgba(247,244,237,.45);letter-spacing:.01em}
        .cform{background:var(--ivory);padding:3rem}
        .cft{font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,2.5vw,2.2rem);font-weight:300;color:var(--ebony);margin-bottom:.35rem}
        .cfs{font-family:'Inter',sans-serif;font-size:.76rem;color:var(--t2);margin-bottom:2.2rem;letter-spacing:.01em}
        .fr{margin-bottom:1rem}
        .fl{display:block;font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.2em;color:var(--t3);text-transform:uppercase;margin-bottom:.42rem}
        .fin,.fse{width:100%;background:var(--bg);border:1px solid var(--bd2);color:var(--ebony);font-family:'Inter',sans-serif;font-size:.88rem;font-weight:300;padding:.82rem 1rem;outline:none;transition:all .3s;appearance:none;border-radius:0}
        .fin::placeholder{color:var(--t3)}.fin:focus,.fse:focus{border-color:var(--felt);background:rgba(139,30,50,.04)}
        .fse{cursor:pointer;color:var(--t2)}.fse option{background:var(--ivory);color:var(--ebony)}
        .fbtn{width:100%;font-family:'Cinzel',serif;font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;color:var(--ivory);background:var(--ebony);padding:1.1rem;border:none;cursor:pointer;transition:all .4s var(--ease);margin-top:.4rem}
        .fbtn:hover{background:var(--felt);transform:translateY(-2px)}
        .fbtn.sent{background:#2e7d32!important;transform:none!important;cursor:default}
        @media(max-width:1100px){.ct{grid-template-columns:1fr;gap:4rem;padding:0 2.5rem}}
        @media(max-width:640px){.ct{padding:0 1.25rem}#cta{padding:6rem 0}.cform{padding:2rem 1.6rem}}
      `}</style>
      <section id="cta">
        <div className="ct">
          <div className="ctl">
            <motion.p style={{fontFamily:"'Cinzel',serif",fontSize:'.5rem',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--brass2)',display:'flex',alignItems:'center',gap:'.8rem',marginBottom:'1.1rem'}} {...rv(0,16,.7)}>
              <span style={{display:'block',width:'22px',height:'1px',background:'var(--brass2)',flexShrink:0}}/>Begin Your Journey
            </motion.p>
            <motion.h2 {...rv(.1,36)}>Reserve Your<br/><em>Place Today.</em></motion.h2>
            <motion.p {...rv(.2,20,.8)}>Seats at Soul of Symphony are limited and filled by students who are serious about their musical development. We invite you to take the first step.</motion.p>
            <div className="crows">
              {[{i:'📞',l:'Phone',v:'+91 98291 53063  ·  +91 97859 08037'},
                {i:'✉',l:'Email',v:'soulofsymphony@gmail.com'},
                {i:'📍',l:'Studio',v:'121 Mohan Nagar, Gopalpura Bypass, Jaipur 302018'},
                {i:'🌐',l:'International',v:'+44 7587 838258'},
              ].map((r,i)=>(
                <motion.div key={i} className="crow" {...rv(.3+i*.08,18,.8)}>
                  <span className="croi">{r.i}</span>
                  <div className="crot"><strong>{r.l}</strong><span>{r.v}</span></div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div className="cform" {...rv(.25,45,1)}>
            <div className="cft">Enquire Today</div>
            <div className="cfs">We respond within 24 hours.</div>
            <div className="fr"><label className="fl">Full Name</label><input className="fin" type="text" placeholder="Your full name"/></div>
            <div className="fr"><label className="fl">Email</label><input className="fin" type="email" placeholder="your@email.com"/></div>
            <div className="fr"><label className="fl">Phone</label><input className="fin" type="tel" placeholder="+91 00000 00000"/></div>
            <div className="fr">
              <label className="fl">Programme</label>
              <select className="fse">
                <option value="">Select a programme</option>
                <option>Little Mozart (Ages 4–6)</option>
                <option>Beginner — Grade Initial to 3</option>
                <option>Intermediate — Grade 4 to 5</option>
                <option>Advanced — Grade 6 to 8</option>
              </select>
            </div>
            <button className={`fbtn${sent?' sent':''}`} onClick={()=>!sent&&setSent(true)}>
              {sent?'✓  Enquiry Sent — We Will Contact You':'Submit Enquiry →'}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════
   FOOTER
══════════════════════════ */
function Footer(){
  return(
    <>
      <style>{`
        footer{background:var(--ebony2);border-top:1px solid rgba(247,244,237,.07);padding:3.5rem 5rem;display:grid;grid-template-columns:1fr auto 1fr;gap:3rem;align-items:center}
        .ftbr{line-height:1.4}
        .ftbrs{display:block;font-family:'Cinzel',serif;font-size:.44rem;letter-spacing:.28em;color:var(--brass2);text-transform:uppercase;margin-bottom:.3rem}
        .ftbrn{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:300;color:rgba(247,244,237,.5);letter-spacing:.02em}
        .ftmd{text-align:center;font-family:'Inter',sans-serif;font-size:.64rem;color:rgba(247,244,237,.25);letter-spacing:.08em;line-height:2}
        .ftmd strong{color:var(--brass2);font-weight:400}
        .ftlk{display:flex;gap:2rem;justify-content:flex-end}
        .ftlk a{font-family:'Cinzel',serif;font-size:.48rem;letter-spacing:.16em;color:rgba(247,244,237,.3);text-transform:uppercase;transition:color .3s}
        .ftlk a:hover{color:var(--brass2)}
        @media(max-width:1100px){footer{grid-template-columns:1fr;text-align:center;padding:3rem 2.5rem;gap:1.8rem}.ftlk{justify-content:center}}
        @media(max-width:640px){footer{padding:2.5rem 1.25rem}.ftlk{gap:1.2rem}}
      `}</style>
      <footer>
        <div className="ftbr"><span className="ftbrs">Soul of Symphony</span><span className="ftbrn">The Piano Conservatoire · Jaipur, India</span></div>
        <div className="ftmd">
          © 2026 Soul of Symphony. All rights reserved.<br/>
          <strong>Pioneer of Western Classical Piano in Rajasthan</strong><br/>
          Trinity College London · Est. 2005
        </div>
        <div className="ftlk">
          <a href="https://www.youtube.com/@soulofsymphony" target="_blank" rel="noreferrer">YouTube</a>
          <a href="https://www.instagram.com/soulofsymphony/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:soulofsymphony@gmail.com">Email</a>
        </div>
      </footer>
    </>
  )
}

/* ══════════════════════════
   APP ROOT
══════════════════════════ */
export default function App(){
  const [loaded,setLoaded]=useState(false)
  return(
    <>
      <AnimatePresence>{!loaded&&<Loader onDone={()=>setLoaded(true)}/>}</AnimatePresence>
      {loaded&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7,ease:EZ}}>
          <Bar/>
          <Cursor/>
          <Nav/>
          <main>
            <Hero/>
            <Band/>
            <Founder/>
            <Endorsements/>
            <AlumniTicker/>
            <Courses/>
            <PianoKeys/>
            <Team/>
            <Instagram/>
            <Testimonials/>
            <FAQ/>
            <CTA/>
          </main>
          <Footer/>
        </motion.div>
      )}
    </>
  )
}
