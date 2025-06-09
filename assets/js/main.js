// STARFIELD (Three.js)
function initStarfield() {
  const container = document.getElementById('starfield');
  const scene     = new THREE.Scene();
  const camera    = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 1, 1000);
  camera.position.z = 400;
  const renderer  = new THREE.WebGLRenderer({ alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const count = 8000;
  const pos   = new Float32Array(count*3);
  for (let i=0; i<count; i++) {
    pos[i*3]   = (Math.random()-0.5)*2000;
    pos[i*3+1] = (Math.random()-0.5)*2000;
    pos[i*3+2] = (Math.random()-0.5)*2000;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat  = new THREE.PointsMaterial({ color:0xffffff, size:1 });
  const stars= new THREE.Points(geom, mat);
  scene.add(stars);

  (function animate(){
    stars.rotation.y += 0.0006;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// TERMINAL TYPING INTRO
function startTerminal() {
  const txtElem = document.getElementById('terminal-text');
  const cont    = document.getElementById('continue-text');
  const message = '>> booting Cyber-Lair v2.0...\n>> loading beats and scripts...\n>> Welcome, Term1nal-Kill\n>> echo "Let\'s rock the net and drop beats!"\n';
  let i = 0;
  (function typer(){
    if (i < message.length) {
      txtElem.innerText += message[i++];
      setTimeout(typer, 30 + Math.random()*30);
    } else {
      setTimeout(() => {
        cont.style.opacity = 1;
        document.addEventListener('keydown', openLair);
      }, 500);
    }
  })();
}
function openLair() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
  document.getElementById('nav').classList.remove('hidden');
  document.removeEventListener('keydown', openLair);
}

// REVEAL ON SCROLL
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

// PROJECT FILTER
function initFilter() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.filter;
      document.querySelectorAll('.card').forEach(c => {
        c.style.display = (cat==='all'||c.dataset.cat===cat) ? '' : 'none';
      });
    };
  });
}

// COPY + CONFETTI
function copyAddress(addr) {
  navigator.clipboard.writeText(addr).then(() => {
    confetti({ particleCount:120, spread:70, origin:{ y:0.6 } });
  });
}

// AUDIO VISUALIZER
function initVisualizer() {
  const audio = document.getElementById('audio');
  const canvas= document.getElementById('visualizer');
  if (!audio||!canvas) return;
  const ctx = canvas.getContext('2d');
  const actx= new (window.AudioContext||window.webkitAudioContext)();
  const src = actx.createMediaElementSource(audio);
  const analyser = actx.createAnalyser();
  src.connect(analyser); analyser.connect(actx.destination);
  analyser.fftSize = 256;
  const data = new Uint8Array(analyser.frequencyBinCount);

  (function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(data);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let x=0, w=(canvas.width/data.length)*2.5;
    data.forEach(v => {
      const h = v/2;
      ctx.fillStyle = '#00ffe7';
      ctx.fillRect(x, canvas.height - h, w, h);
      x += w+1;
    });
  })();
}

// INITIALIZE ALL
window.addEventListener('load', () => {
  initStarfield();
  startTerminal();
  initReveal();
  initFilter();
  initVisualizer();
});
