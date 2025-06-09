// starfield via three.js
function initStarfield() {
  const container = document.getElementById('starfield');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.z = 400;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  // create points
  const count = 8000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random()-0.5)*2000;
    positions[i*3+1] = (Math.random()-0.5)*2000;
    positions[i*3+2] = (Math.random()-0.5)*2000;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(geom, mat);
  scene.add(stars);
  function anim() {
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
    requestAnimationFrame(anim);
  }
  anim();
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// terminal intro
function startTerminal() {
  const txtEl = document.getElementById('terminal-text');
  const contEl = document.getElementById('continue-text');
  const text = '>> Welcome, Term1nal-K1ll\n>> echo "Lets rock the net and drop beats."\n';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      txtEl.innerText += text.charAt(i++);
      setTimeout(typeChar, 50);
    } else {
      setTimeout(() => { contEl.style.opacity = 1; document.addEventListener('keydown', openSite); }, 300);
    }
  }
  typeChar();
}
function openSite() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
  document.querySelector('nav').classList.remove('hidden');
  document.removeEventListener('keydown', openSite);
}

// simple ScrollReveal
function initReveal() {
  ScrollReveal().reveal('.reveal', { distance: '20px', origin: 'bottom', interval: 100 });
}

// konami code
function initKonami() {
  const seq = [38,38,40,40,37,39,37,39,66,65];
  let idx = 0;
  window.addEventListener('keydown', e => {
    if (e.keyCode === seq[idx]) idx++;
    else idx = 0;
    if (idx === seq.length) window.location = '404.html';
  });
}

// project filter (demo)
function initFilter() {
  const buttons = document.querySelectorAll('[data-filter]');
  buttons.forEach(btn => btn.onclick = () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) card.style.display = '';
      else card.style.display = 'none';
    });
  });
}

// copy + confetti
function copyAddress(addr) {
  navigator.clipboard.writeText(addr);
  confetti({ particleCount:100, spread:70, origin:{ y:0.6 } });
  alert('Copied wallet address!');
}

// audio visualizer
function initAudioVis() {
  const audio = document.getElementById('audio');
  if (!audio) return;
  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const data = new Uint8Array(analyser.frequencyBinCount);
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(data);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let x=0;
    const w = (canvas.width/data.length)*2.5;
    for (let i=0;i<data.length;i++){
      const h = data[i]/2;
      ctx.fillRect(x,canvas.height-h,w,h);
      x += w+1;
    }
  }
  draw();
}

// init all
window.addEventListener('load', () => {
  initStarfield();
  startTerminal();
  initReveal();
  initKonami();
  initFilter();
  initAudioVis();
});
