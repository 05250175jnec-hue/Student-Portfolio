// Hero section: prayer-flag bunting, typing effect and interactive network background.
(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Prayer-flag bunting (SVG) ----
  const FLAG_COLORS = ['#2459c7', '#f3f3f3', '#c9382a', '#237a4b', '#e8a900'];
  const FLAG_COUNT = 20;

  function buildBunting() {
    let svg = '';
    for (let i = 0; i < FLAG_COUNT; i++) {
      const x = 25 + i * 49;
      const t = x / 1000;
      const y = 6 + 68 * t * (1 - t); // flags follow the sag of the string
      svg +=
        `<g class="flag" style="transform-origin:${x}px ${y}px">` +
        `<rect x="${x - 14}" y="${y}" width="28" height="38" fill="${FLAG_COLORS[i % FLAG_COLORS.length]}" opacity=".92"/>` +
        '</g>';
    }
    $('#bunting').innerHTML = svg;
  }

  // ---- Typing effect ----
  const ROLES = [
    'Computer Systems and Networking student',
    'future network engineer',
    'curious AI learner',
    'full-stack web builder',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const role = ROLES[roleIndex];
    $('#typed').textContent = role.slice(0, charIndex);

    if (!deleting && charIndex === role.length) {
      deleting = true;
      setTimeout(type, 1600); // pause on the finished word
      return;
    }
    if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
    }
    charIndex += deleting ? -1 : 1;
    setTimeout(type, deleting ? 30 : 60);
  }

  // ---- Network canvas ----
  const canvas = $('#net');
  const ctx = canvas.getContext('2d');
  const LINK_DISTANCE = 130;
  const MOUSE_RANGE = 200;
  let width = 0;
  let height = 0;
  let nodes = [];
  let mouse = { x: -999, y: -999 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    const count = Math.min(60, Math.floor(width / 22));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    if (reducedMotion) draw();
  }

  function step() {
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Nodes drift toward the cursor.
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < MOUSE_RANGE && distance > 1) {
        node.x += (dx / distance) * 0.7;
        node.y += (dy / distance) * 0.7;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const rgb = getComputedStyle(root).getPropertyValue('--node').trim();

    nodes.forEach((a, i) => {
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - distance / LINK_DISTANCE) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${rgb},.85)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function loop() {
    step();
    draw();
    requestAnimationFrame(loop);
  }

  const hero = $('#home');
  hero.addEventListener('pointermove', (event) => {
    const box = canvas.getBoundingClientRect();
    mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
  });
  hero.addEventListener('pointerleave', () => {
    mouse = { x: -999, y: -999 };
  });
  addEventListener('resize', resize);

  buildBunting();
  type();
  resize();
  // With reduced motion the network is drawn once and stays still.
  if (!reducedMotion) loop();
})();
