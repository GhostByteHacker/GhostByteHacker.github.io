// ——— Starfield Background (Three.js) ———
function initStarfield() {
  const container = document.getElementById('starfield');
  const scene     = new THREE.Scene();
  const camera    = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 1, 1000);
  const renderer  = new THREE.WebGLRenderer({ alpha:true });
  camera.position.z = 400;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // generate points
  const pts = 8000;
  const pos = new Float32Array(pts * 3);
  for (let i = 0; i < pts; i++) {
    pos[i*3]   = (Math.random()-0.5)*2000;
    pos[i*3+1] = (Math.random()-0.5)*2000;
    pos[i*3+2] = (Math.random()-0.5)*2000;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ color:0xffffff, size:1 });
  const stars = new THREE.Points(geom, mat);
  scene.add(stars);

  // animate
  (function anim(){
    stars.rotation.y += 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(anim);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ——— Fancy Terminal Intro ———
function startTerminal() {
  const txt = document.getElementById('terminal-text');
  const cue = document.getElementById('continue-text');
  const msg = '>> Welcome, Term1nal-Kill\n>> echo "Let\'s rock the net and drop beats!"\n';
  let i = 0;
  (function type(){
    if (i < msg.length) {
      txt.innerText += msg[i++];
      setTimeout(type, 40 + Math.random()*20);
    } else {
      setTimeout(() => { cue.style.opacity = 1; document.addEventListener('keydown', openSite); }, 400);
    }
  })();
}
function openSite() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
  document.querySelector('nav').classList.remove('hidden');
  document.removeEventListener('keydown', openSite);
}

// ——— IntersectionObserver Reveal ———
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ——— Project Filtering ———
function initFilter() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(c => {
        c.style.display = (cat==='all' || c.dataset.cat===cat) ? '' : 'none';
      });
    };
  });
}

// ——— Copy Address + Confetti ———
function copyAddress(addr) {
  navigator.clipboard.writeText(addr).then(() => {
    confetti({ particleCount: 120, spread: 80, origin:{ y:0.6 } });
  });
}

// ——— Audio Visualizer ———
function initAudioVis() {
  const audio = document.getElementById('audio');
  const canvas = document.getElementById('visualizer');
  if (!audio||!canvas) return;
  const ctx = canvas.getContext('2d');
  const actx = new (window.AudioContext||window.webkitAudioContext)();
  const src  = actx.createMediaElementSource(audio);
  const analyser = actx.createAnalyser();
  src.connect(analyser); analyser.connect(actx.destination);
  analyser.fftSize = 256;
  const data = new Uint8Array(analyser.frequencyBinCount);

  (function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(data);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let x=0, w=(canvas.width/data.length)*2.5;
    data.forEach(v => {
      const h = v/2;
      ctx.fillRect(x, canvas.height-h, w, h);
      x += w+1;
    });
  })();
}

// ——— Boot Everything ———
window.addEventListener('load', () => {
  initStarfield();
  startTerminal();
  initReveal();
  initFilter();
  initAudioVis();
});
