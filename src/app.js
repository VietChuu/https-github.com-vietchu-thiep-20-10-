(function () {
  const cfg = Object.assign({}, window.CARD_CONFIG || {});

  // Allow quick customization via URL query parameters (?to=...&from=...&start=...)
  const params = new URLSearchParams(window.location.search);
  if (params.get("to")) cfg.recipientName = params.get("to");
  if (params.get("from")) cfg.senderName = params.get("from");
  if (params.get("date")) cfg.dateText = params.get("date");
  if (params.get("start")) cfg.loveStartDate = params.get("start");
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
  setText("counter-title", cfg.loveCounterTitle);
  setText("counter-subtitle", cfg.loveCounterSubtitle);
  setText("gallery-title", cfg.galleryTitle);
  setText("gallery-subtitle", cfg.gallerySubtitle);
  setText("quiz-title", cfg.loveQuestionTitle);
  setText("quiz-prompt", cfg.loveQuestionPrompt);
  setText("btn-love-yes", cfg.loveYesText);
  setText("quiz-success-msg", cfg.loveSuccessMessage);
  setText("secret-title", cfg.secretMessageTitle);
  setText("secret-body", cfg.secretMessageBody);
  setText("secret-voucher", cfg.secretVoucherText);

  const avatarLeft = document.getElementById("couple-avatar-left");
  const avatarRight = document.getElementById("couple-avatar-right");
  if (avatarLeft && cfg.coupleAvatarLeft) avatarLeft.src = cfg.coupleAvatarLeft;
  if (avatarRight && cfg.coupleAvatarRight) avatarRight.src = cfg.coupleAvatarRight;

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
    spawnKissHearts(12);

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
  // 3. LOVE COUNTER (ĐỒNG HỒ ĐẾM NGÀY YÊU)
  // ==========================================================================
  const startStr = cfg.loveStartDate || "2024-02-14";
  const startDate = new Date(`${startStr}T00:00:00`);
  const daysEl = document.getElementById("count-days");
  const hoursEl = document.getElementById("count-hours");
  const minsEl = document.getElementById("count-mins");
  const secsEl = document.getElementById("count-secs");
  const startBadgeEl = document.getElementById("love-start-badge");

  if (!isNaN(startDate.getTime())) {
    const d = String(startDate.getDate()).padStart(2, "0");
    const m = String(startDate.getMonth() + 1).padStart(2, "0");
    const y = startDate.getFullYear();
    if (startBadgeEl) {
      startBadgeEl.textContent = cfg.loveStartLabel || `✨ Bắt đầu nhắn tin từ ngày ${d}/${m}/${y} ✨`;
    }

    function updateLoveCounter() {
      const now = new Date();
      const diffMs = Math.max(0, now - startDate);
      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");
    }

    updateLoveCounter();
    setInterval(updateLoveCounter, 1000);
  }

  // ==========================================================================
  // 4. POLAROID GALLERY & LIGHTBOX
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

    const imgStyle = [
      photo.fit ? `object-fit: ${photo.fit};` : "",
      photo.position ? `object-position: ${photo.position};` : ""
    ].filter(Boolean).join(" ");

    card.innerHTML = `
      <div class="polaroid-img-wrap">
        <img src="${photo.src}" alt="${photo.caption || 'Kỷ niệm'}" loading="lazy" style="${imgStyle}" />
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
  // 5. RUNAWAY "KHÔNG" BUTTON MINI-GAME ("EM CÓ YÊU ANH KHÔNG?")
  // ==========================================================================
  const btnYes = document.getElementById("btn-love-yes");
  const btnNo = document.getElementById("btn-love-no");
  const quizArena = document.getElementById("quiz-arena");
  const quizEmoji = document.getElementById("quiz-emoji");
  const quizSuccessBox = document.getElementById("quiz-success-box");
  const noTexts = cfg.loveNoTexts || ["Hông thèm đâu 😜", "Bấm nút màu hồng kìa 💕"];
  const reactionEmojis = ["😳", "🥺", "😭", "😤", "🙈", "😘"];
  let dodgeCount = 0;

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    dodgeCount++;

    // Update text and emoji
    btnNo.textContent = noTexts[dodgeCount % noTexts.length];
    if (quizEmoji) {
      quizEmoji.textContent = reactionEmojis[dodgeCount % reactionEmojis.length];
      quizEmoji.style.transform = "scale(1.2)";
      setTimeout(() => { quizEmoji.style.transform = "scale(1)"; }, 200);
    }

    // Grow the "Yes" button
    const yesScale = Math.min(1 + dodgeCount * 0.14, 1.85);
    btnYes.style.transform = `scale(${yesScale})`;

    // Move the "No" button to a random safe position inside quizArena
    const arenaRect = quizArena.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = Math.max(20, arenaRect.width - btnRect.width - 16);
    const maxY = Math.max(20, arenaRect.height - btnRect.height - 16);

    const randX = 8 + Math.random() * maxX;
    const randY = 8 + Math.random() * maxY;

    btnNo.style.position = "absolute";
    btnNo.style.left = `${randX}px`;
    btnNo.style.top = `${randY}px`;
  }

  if (btnNo && btnYes && quizArena) {
    btnNo.addEventListener("mouseenter", dodgeNoButton);
    btnNo.addEventListener("touchstart", dodgeNoButton, { passive: false });
    btnNo.addEventListener("click", dodgeNoButton);

    btnYes.addEventListener("click", () => {
      quizArena.style.display = "none";
      if (quizEmoji) quizEmoji.textContent = "🥰";
      quizSuccessBox.classList.add("active");
      spawnKissHearts(28);
    });
  }

  // ==========================================================================
  // 6. INTERACTIVE KISS HEARTS, SECRET GIFT BOX & TOUCH SPARKLE BURST
  // ==========================================================================
  function spawnKissHearts(count = 12) {
    const symbols = ["❤️", "💖", "🌸", "🌷", "💕", "✨", "🥰"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "floating-heart";
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = `${10 + Math.random() * 80}vw`;
        el.style.bottom = `${8 + Math.random() * 30}vh`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1850);
      }, i * 65);
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
      spawnKissHearts(22);
    });
  }

  // Touch / Click Blossom & Heart Sparkle Burst anywhere on screen
  const sparkleSymbols = ["🌸", "💖", "✨", "🌷", "💕", "❤️"];
  document.addEventListener("pointerdown", (e) => {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const sp = document.createElement("span");
      sp.className = "touch-sparkle";
      sp.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
      sp.style.left = `${e.clientX}px`;
      sp.style.top = `${e.clientY}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 36 + Math.random() * 48;
      sp.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      sp.style.setProperty("--ty", `${Math.sin(angle) * dist - 18}px`);
      sp.style.setProperty("--rot", `${(Math.random() - 0.5) * 90}deg`);

      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 950);
    }
  });

  // ==========================================================================
  // 7. FALLING ROSE PETALS CANVAS ANIMATION
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
