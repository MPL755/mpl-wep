// ── CUSTOM CURSOR
try {
  var cur=document.getElementById('cursor'), ring=document.getElementById('cursor-ring');
  if(window.matchMedia('(hover:hover)').matches && cur && ring){
    var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    document.addEventListener('mousemove',function(e){
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    (function animRing(){
      rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(animRing);
    })();
  } else {
    if(cur) cur.style.display='none';
    if(ring) ring.style.display='none';
    document.body.style.cursor='auto';
  }
} catch(ex){}

// ── SCROLL PROGRESS + NAV
try {
  var spb=document.getElementById('spb'), nb=document.getElementById('nb');
  window.addEventListener('scroll',function(){
    var p=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
    if(spb) spb.style.width=Math.min(p,100)+'%';
    if(nb) nb.classList.toggle('sc',window.scrollY>50);
  });
} catch(ex){}

// ── HERO CANVAS PARTICLES
try {
  var canvas=document.getElementById('hero-canvas');
  if(canvas){
    var ctx=canvas.getContext('2d');
    if(ctx){
      var W=0,H=0,pts=[];
      function resizeCanvas(){
        W=canvas.width=canvas.offsetWidth||window.innerWidth;
        H=canvas.height=canvas.offsetHeight||window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize',function(){ resizeCanvas(); initPts(); });
      function initPts(){
        pts=[];
        var n=Math.min(Math.floor(W*H/14000),55);
        for(var i=0;i<n;i++) pts.push({
          x:Math.random()*W, y:Math.random()*H,
          vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
          r:Math.random()*1.3+.4, o:Math.random()*.35+.08
        });
      }
      initPts();
      function drawCanvas(){
        ctx.clearRect(0,0,W,H);
        for(var i=0;i<pts.length;i++){
          var p=pts[i];
          p.x+=p.vx; p.y+=p.vy;
          if(p.x<0||p.x>W) p.vx*=-1;
          if(p.y<0||p.y>H) p.vy*=-1;
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle='rgba(232,119,26,'+p.o+')'; ctx.fill();
          for(var j=i+1;j<pts.length;j++){
            var dx=p.x-pts[j].x, dy=p.y-pts[j].y;
            var d=Math.sqrt(dx*dx+dy*dy);
            if(d<110){
              ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(pts[j].x,pts[j].y);
              ctx.strokeStyle='rgba(232,119,26,'+(0.07*(1-d/110))+')';
              ctx.lineWidth=.5; ctx.stroke();
            }
          }
        }
        requestAnimationFrame(drawCanvas);
      }
      drawCanvas();
    }
  }
} catch(ex){}

// ── COUNTER ANIMATION
function animateCount(el, target){
  var dur=1500, start=null;
  function run(ts){
    if(!start) start=ts;
    var p=Math.min((ts-start)/dur,1);
    var ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(ease*target);
    if(p<1) requestAnimationFrame(run);
    else el.textContent=target;
  }
  requestAnimationFrame(run);
}
try {
  var statEls=document.querySelectorAll('.sn[data-count]');
  if(statEls.length){
    var statsDone=false;
    function runStats(){
      if(statsDone) return;
      statsDone=true;
      statEls.forEach(function(el){
        animateCount(el, parseInt(el.getAttribute('data-count'))||0);
      });
    }
    // Fire after hero animation (1.1s delay) OR on first scroll
    setTimeout(runStats, 1100);
    window.addEventListener('scroll', runStats, {once:true});
  }
} catch(ex){}

// ── 3D CARD TILT (desktop only)
try {
  if(window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.pc').forEach(function(card){
      card.addEventListener('mousemove',function(e){
        var r=card.getBoundingClientRect();
        var dx=(e.clientX-r.left-r.width/2)/(r.width/2);
        var dy=(e.clientY-r.top-r.height/2)/(r.height/2);
        card.style.transform='translateY(-4px) rotateX('+(-dy*4).toFixed(1)+'deg) rotateY('+(dx*4).toFixed(1)+'deg)';
        card.style.transition='transform .05s';
      });
      card.addEventListener('mouseleave',function(){
        card.style.transform='';
        card.style.transition='transform .5s ease';
      });
    });
  }
} catch(ex){}

// ── SCROLL REVEAL
try {
  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e,i){
      if(e.isIntersecting){
        setTimeout(function(){ e.target.classList.add('in'); }, i*55);
        revObs.unobserve(e.target);
      }
    });
  },{threshold:.06, rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){ revObs.observe(el); });
} catch(ex){}

// ── LANGUAGE TOGGLE
function setL(lang){
  try {
    var html=document.documentElement;
    html.setAttribute('lang',lang);
    html.setAttribute('dir',lang==='ar'?'rtl':'ltr');
    var bAR=document.getElementById('bAR'), bEN=document.getElementById('bEN');
    if(bAR) bAR.classList.toggle('on',lang==='ar');
    if(bEN) bEN.classList.toggle('on',lang==='en');
    document.querySelectorAll('[data-ar][data-en]').forEach(function(el){
      var v=el.getAttribute('data-'+lang);
      if(v!==null) el.innerHTML=v;
    });
  } catch(ex){}
}
setL('ar');

// ── PRIVACY MODAL
function openPrivacy(){ try{document.getElementById('prvModal').classList.add('open');}catch(ex){} }
function closePrivacy(){ try{document.getElementById('prvModal').classList.remove('open');}catch(ex){} }
try{
  document.getElementById('prvModal').addEventListener('click',function(e){
    if(e.target===this) closePrivacy();
  });
}catch(ex){}

// ── MAGNETIC BUTTONS
try {
  if(window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.bp,.ncta').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){
        var r=btn.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*.13;
        var y=(e.clientY-r.top-r.height/2)*.13;
        btn.style.transform='translate('+x+'px,'+y+'px)';
      });
      btn.addEventListener('mouseleave',function(){ btn.style.transform=''; });
    });
  }
} catch(ex){}