(function () {
  const cfg = Object.assign({}, window.CARD_CONFIG || {});

  // Allow quick customization via URL query parameters (?to=...&from=...)
  const params = new URLSearchParams(window.location.search);
  if (params.get("to")) cfg.recipientName = params.get("to");
  if (params.get("from")) cfg.senderName = params.get("from");
  if (params.get("date")) cfg.dateText = params.get("date");
  if (params.get("msg")) {
    cfg.letterParagraphs = params.get("msg").split("|").map(s => s.trim()).filter(Boolean);
  }

  // Populate static text elements
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };

  setText("intro-date-pill", `🌸 ${cfg.dateText || "20 • 10"}`);
  setText("intro-title", cfg.envelopeTitle);
  setText("intro-subtitle", cfg.envelopeSubtitle);
  setText("preview-to", `Gửi ${cfg.recipientName} 💕`);
  setText("letter-badge", cfg.badgeText);
  setText("letter-title", `Chúc Mừng 20/10, ${cfg.recipientName}!`);
  setText("letter-date", cfg.dateText);
  setText("letter-greeting", cfg.letterGreeting);
  setText("letter-closing", cfg.letterClosing);
  setText("letter-sender", `${cfg.senderName} ❤️`);
  setText("gallery-title", cfg.galleryTitle);
  setText("gallery-subtitle", cfg.gallerySubtitle);
  setText("secret-title", cfg.secretMessageTitle);
  setText("secret-body", cfg.secretMessageBody);
  setText("secret-voucher", cfg.secretVoucherText);

  // ==========================================================================
  // 1. ROMANTIC MUSIC BOX / MP3 AUDIO ENGINE
  // ==========================================================================
  const musicBtn = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  let isPlayingMusic = false;
  let audioEl = null;
  let audioCtx = null;
  let musicTimer = null;

  if (cfg.customMusicUrl) {
    audioEl = new Audio(cfg.customMusicUrl);
    audioEl.loop = true;
  }

  // Dreamy Music Box notes (Romantic Canon / Love Melody in F Major)
  const melodySequence = [
    { f: 523.25, d: 0.45 }, { f: 659.25, d: 0.45 }, { f: 783.99, d: 0.45 }, { f: 659.25, d: 0.45 },
    { f: 440.00, d: 0.45 }, { f: 523.25, d: 0.45 }, { f: 659.25, d: 0.45 }, { f: 523.25, d: 0.45 },
    { f: 349.23, d: 0.45 }, { f: 440.00, d: 0.45 }, { f: 523.25, d: 0.45 }, { f: 440.00, d: 0.45 },
    { f: 392.00, d: 0.45 }, { f: 493.88, d: 0.45 }, { f: 587.33, d: 0.90 },
    { f: 523.25, d: 0.45 }, { f: 659.25, d: 0.45 }, { f: 880.00, d: 0.45 }, { f: 783.99, d: 0.45 },
    { f: 659.25, d: 0.45 }, { f: 523.25, d: 0.45 }, { f: 587.33, d: 0.45 }, { f: 493.88, d: 0.45 },
    { f: 523.25, d: 1.20 }
  ];
  let noteIdx = 0;

  function playMusicBoxNote(freq, duration) {
    if (!audioCtx || !isPlayingMusic) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Soft bell envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration * 2.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration * 2.3);
  }

  function stepMusicBox() {
    if (!isPlayingMusic) return;
    const note = melodySequence[noteIdx % melodySequence.length];
    playMusicBoxNote(note.f, note.d);
    noteIdx++;
    musicTimer = setTimeout(stepMusicBox, note.d * 1000);
  }

  function startMusic() {
    if (isPlayingMusic) return;
    isPlayingMusic = true;
    musicBtn.classList.add("playing");
    musicLabel.textContent = "Đang phát nhạc";

    if (audioEl) {
      audioEl.play().catch(() => {});
    } else {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === "suspended") audioCtx.resume();
        stepMusicBox();
      }
    }
  }

  function stopMusic() {
    isPlayingMusic = false;
    musicBtn.classList.remove("playing");
    musicLabel.textContent = "Bật nhạc nền";
    if (audioEl) {
      audioEl.pause();
    }
    if (musicTimer) {
      clearTimeout(musicTimer);
      musicTimer = null;
    }
  }

  musicBtn.addEventListener("click", () => {
    if (isPlayingMusic) stopMusic();
    else startMusic();
  });

  // ==========================================================================
  // 2. ENVELOPE OPENING & TYPEWRITER LETTER
  // ==========================================================================
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const openBtn = document.getElementById("open-envelope-btn");
  const envelopeStage = document.getElementById("envelope-stage");
  const mainContent = document.getElementById("main-card-content");
  const letterBodyEl = document.getElementById("letter-body");
  let isOpened = false;

  function renderLetterTypewriter() {
    const paragraphs = cfg.letterParagraphs || [];
    letterBodyEl.innerHTML = "";
    const pElements = paragraphs.map(() => {
      const p = document.createElement("p");
      letterBodyEl.appendChild(p);
      return p;
    });

    let pIndex = 0;
    let charIndex = 0;
    let skipped = false;

    const finishImmediately = () => {
      if (skipped) return;
      skipped = true;
      paragraphs.forEach((text, i) => {
        pElements[i].textContent = text;
      });
    };

    // Allow clicking the letter paper to finish typing immediately
    document.querySelector(".letter-paper").addEventListener("click", finishImmediately, { once: true });

    function typeNextChar() {
      if (skipped) return;
      if (pIndex >= paragraphs.length) return;
      const currentText = paragraphs[pIndex];
      pElements[pIndex].textContent = currentText.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex < currentText.length) {
        setTimeout(typeNextChar, 22);
      } else {
        pIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 320);
      }
    }

    typeNextChar();
  }

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;
    startMusic();
    envelopeWrapper.classList.add("open");
    spawnKissHearts(10);

    setTimeout(() => {
      envelopeStage.classList.add("hidden-stage");
      mainContent.classList.add("visible");
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderLetterTypewriter();
    }, 1050);
  }

  envelopeWrapper.addEventListener("click", openEnvelope);
  openBtn.addEventListener("click", openEnvelope);

  // ==========================================================================
  // 3. POLAROID GALLERY & LIGHTBOX
  // ==========================================================================
  const galleryGrid = document.getElementById("polaroid-grid");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDate = document.getElementById("lightbox-date");
  let currentPhotoIdx = 0;
  const photos = cfg.photos || [];

  function openLightbox(index) {
    if (!photos.length) return;
    currentPhotoIdx = (index + photos.length) % photos.length;
    const item = photos[currentPhotoIdx];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption || "";
    lightboxDate.textContent = item.date || "";
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  photos.forEach((photo, idx) => {
    const card = document.createElement("div");
    card.className = "polaroid-card";
    card.style.setProperty("--rot", photo.rotation || (idx % 2 === 0 ? "-2.5deg" : "2.5deg"));

    card.innerHTML = `
      <div class="polaroid-img-wrap">
        <img src="${photo.src}" alt="${photo.caption || 'Kỷ niệm'}" loading="lazy" />
      </div>
      <div class="polaroid-caption">${photo.caption || ""}</div>
      <span class="polaroid-date">${photo.date || ""}</span>
    `;

    card.addEventListener("click", () => openLightbox(idx));
    galleryGrid.appendChild(card);
  });

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => openLightbox(currentPhotoIdx - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => openLightbox(currentPhotoIdx + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ==========================================================================
  // 4. INTERACTIVE KISS HEARTS & SECRET GIFT BOX
  // ==========================================================================
  function spawnKissHearts(count = 12) {
    const symbols = ["❤️", "💖", "🌸", "🌷", "💕", "✨"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "floating-heart";
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = `${15 + Math.random() * 70}vw`;
        el.style.bottom = `${10 + Math.random() * 25}vh`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1850);
      }, i * 80);
    }
  }

  const sendLoveBtn = document.getElementById("send-love-btn");
  if (sendLoveBtn) {
    sendLoveBtn.addEventListener("click", () => spawnKissHearts(16));
  }

  const giftBtn = document.getElementById("gift-box-btn");
  const giftReveal = document.getElementById("gift-reveal-card");
  if (giftBtn && giftReveal) {
    giftBtn.addEventListener("click", () => {
      giftReveal.classList.add("open");
      spawnKissHearts(20);
    });
  }

  // ==========================================================================
  // 5. FALLING ROSE PETALS CANVAS ANIMATION
  // ==========================================================================
  const canvas = document.getElementById("petals-canvas");
  const ctx = canvas.getContext("2d");
  let cw = (canvas.width = window.innerWidth);
  let ch = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
  });

  const petalColors = [
    "rgba(255, 117, 143, 0.55)",
    "rgba(255, 179, 198, 0.65)",
    "rgba(251, 111, 146, 0.45)",
    "rgba(255, 204, 213, 0.7)"
  ];

  const petals = Array.from({ length: 28 }, () => ({
    x: Math.random() * cw,
    y: Math.random() * ch,
    r: 6 + Math.random() * 8,
    vy: 0.6 + Math.random() * 1.1,
    vx: -0.4 + Math.random() * 0.8,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.025,
    color: petalColors[Math.floor(Math.random() * petalColors.length)]
  }));

  function drawPetals() {
    ctx.clearRect(0, 0, cw, ch);
    for (const p of petals) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.angle) * 0.35;
      p.angle += p.spin;

      if (p.y > ch + 20) {
        p.y = -20;
        p.x = Math.random() * cw;
      }
      if (p.x > cw + 20) p.x = -20;
      if (p.x < -20) p.x = cw + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r, -p.r, p.r, p.r, 0, p.r);
      ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r, 0, -p.r);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(drawPetals);
  }

  drawPetals();
})();
