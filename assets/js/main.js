// ——— Starfield Background ———
function initStarfield() {
  const container = document.getElementById('starfield');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.z = 400;
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const count = 8000;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 2000;
    pos[i*3+1] = (Math.random() - 0.5) * 2000;
    pos[i*3+2] = (Math.random() - 0.5) * 2000;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  const stars = new THREE.Points(geom, mat);
  scene.add(stars);

  function animate() {
    stars.rotation.y += 0.0005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ——— Fake Terminal Intro ———
function startTerminal() {
  const textEl = document.getElementById('terminal-text');
  const contEl = document.getElementById('continue-text');
  const message = '>> Welcome, Term1nal-Kill\n>> echo "Let\'s rock the net and drop beats."\n';
  let i = 0;

  function type() {
    if (i < message.length) {
      textEl.innerText += message[i++];
      setTimeout(type, 50);
    } else {
      setTimeout(() => {
        contEl.style.opacity = 1;
        document.addEventListener('keydown', openSite);
      }, 300);
    }
  }
  type();
}

function openSite() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('content').classList.remove('hidden');
  document.querySelector('nav').classList.remove('hidden');
  document.removeEventListener('keydown', openSite);
}

// ——— ScrollReveal Setup ———
function initReveal() {
  ScrollReveal().reveal('.reveal', {
    distance: '20px',
    origin: 'bottom',
    interval: 100,
    cleanup: true
  });
}

// ——— Project Filter Buttons ———
function initFilter() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

// ——— Copy & Confetti ———
function copyAddress(address) {
  navigator.clipboard.writeText(address)
    .then(() => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      alert('Copied wallet address!');
    });
}

// ——— Audio Visualizer ———
function initAudioVis() {
  const audio = document.getElementById('audio');
  const canvas = document.getElementById('visualizer');
  if (!audio || !canvas) return;

  const ctx = canvas.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  src.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const data = new Uint8Array(analyser.frequencyBinCount);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 0;
    const barWidth = (canvas.width / data.length) * 2.5;
    for (let i = 0; i < data.length; i++) {
      const barHeight = data[i] / 2;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  draw();
}

// ——— Initialize Everything ———
window.addEventListener('load', () => {
  initStarfield();
  startTerminal();
  initReveal();
  initFilter();
  initAudioVis();
});
