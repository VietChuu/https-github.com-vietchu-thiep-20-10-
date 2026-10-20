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
  setText("scratch-title", cfg.scratchTitle);
  setText("scratch-subtitle", cfg.scratchSubtitle);
  setText("scratch-headline", cfg.scratchSecretHeadline);
  setText("scratch-msg", cfg.scratchSecretMessage);
  setText("scratch-badge", cfg.scratchSecretBadge);
  setText("jar-title", cfg.jarTitle);
  setText("jar-subtitle", cfg.jarSubtitle);
  setText("secret-title", cfg.secretMessageTitle);
  setText("secret-body", cfg.secretMessageBody);
  setText("secret-voucher", cfg.secretVoucherText);

  const scratchImgEl = document.getElementById("scratch-img");
  if (scratchImgEl && cfg.scratchImage) scratchImgEl.src = cfg.scratchImage;

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
      initScratchCard();
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
      startBadgeEl.textContent = cfg.loveStartLabel || `✨ Bên nhau từ ngày ${d}/${m}/${y} ✨`;
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
  // 4. INTERACTIVE INSTAX CAMERA, PHOTO DEVELOPING & LIGHTBOX
  // ==========================================================================
  const galleryGrid = document.getElementById("polaroid-grid");
  const albumWallHeader = document.getElementById("album-wall-header");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDate = document.getElementById("lightbox-date");

  const shutterBtn = document.getElementById("instax-shutter-btn");
  const instaxLens = document.getElementById("instax-lens");
  const shootCtaBtn = document.getElementById("instax-shoot-cta");
  const printAllBtn = document.getElementById("instax-print-all-btn");
  const instaxFlash = document.getElementById("instax-flash");
  const filmCountEl = document.getElementById("instax-film-count");
  const lensPreviewImg = document.getElementById("lens-preview-img");
  const ejectZone = document.getElementById("instax-eject-zone");
  const developingCard = document.getElementById("instax-developing-card");
  const developingImg = document.getElementById("developing-img");
  const developingOverlay = document.getElementById("developing-overlay");
  const developingCaption = document.getElementById("developing-caption");
  const developingDate = document.getElementById("developing-date");

  let currentPhotoIdx = 0;
  let shotIndex = 0;
  let isShooting = false;
  const photos = cfg.photos || [];
  const printedSet = new Set();

  function playShutterSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    // Crisp shutter click
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // Soft film motor whir
    const motorOsc = audioCtx.createOscillator();
    const motorGain = audioCtx.createGain();
    motorOsc.type = "sine";
    motorOsc.frequency.setValueAtTime(210, now + 0.08);
    motorOsc.frequency.linearRampToValueAtTime(260, now + 0.48);
    motorGain.gain.setValueAtTime(0.001, now + 0.08);
    motorGain.gain.linearRampToValueAtTime(0.04, now + 0.14);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
    motorOsc.connect(motorGain);
    motorGain.connect(audioCtx.destination);
    motorOsc.start(now + 0.08);
    motorOsc.stop(now + 0.55);
  }

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

  function createPolaroidCard(photo, idx, animateDeveloping = false) {
    const card = document.createElement("div");
    card.className = "polaroid-card";
    card.style.setProperty("--rot", photo.rotation || (idx % 2 === 0 ? "-2.5deg" : "2.5deg"));

    const imgStyle = [
      photo.fit ? `object-fit: ${photo.fit};` : "",
      photo.position ? `object-position: ${photo.position};` : ""
    ].filter(Boolean).join(" ");

    card.innerHTML = `
      <div class="polaroid-img-wrap">
        <img src="${photo.src}" alt="${photo.caption || 'Kỷ niệm'}" loading="lazy" style="${imgStyle}" class="${animateDeveloping ? 'developing' : ''}" />
      </div>
      <div class="polaroid-caption">${photo.caption || ""}</div>
      <span class="polaroid-date">${photo.date || ""}</span>
    `;

    card.addEventListener("click", () => openLightbox(idx));
    return card;
  }

  function updateCameraStatus() {
    const remaining = Math.max(0, photos.length - shotIndex);
    if (filmCountEl) filmCountEl.textContent = remaining;

    if (lensPreviewImg && photos.length) {
      const nextPhoto = photos[shotIndex % photos.length];
      lensPreviewImg.src = nextPhoto.src;
    }

    if (shootCtaBtn) {
      if (shotIndex < photos.length) {
        shootCtaBtn.textContent = `📸 Bấm chụp tấm tiếp theo (${shotIndex + 1}/${photos.length})`;
      } else {
        shootCtaBtn.textContent = "🔄 Chụp lại từ tấm đầu tiên";
      }
    }
  }

  function shootNextPhoto() {
    if (isShooting || !photos.length) return;
    isShooting = true;

    if (shotIndex >= photos.length) {
      shotIndex = 0;
    }

    const idx = shotIndex;
    const photo = photos[idx];
    shotIndex++;

    // 1. Sound + Flash
    playShutterSound();
    if (instaxFlash) {
      instaxFlash.classList.add("flashing");
      setTimeout(() => instaxFlash.classList.remove("flashing"), 420);
    }

    const screenFlash = document.createElement("div");
    screenFlash.className = "camera-screen-flash";
    document.body.appendChild(screenFlash);
    setTimeout(() => screenFlash.remove(), 560);

    // 2. Eject & Develop in Tray
    if (ejectZone && developingCard && developingImg) {
      ejectZone.classList.add("active");
      developingCard.style.animation = "none";
      void developingCard.offsetWidth;
      developingCard.style.animation = "slideOutFilm 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards";

      developingImg.className = "";
      developingImg.src = photo.src;
      developingImg.style.objectFit = photo.fit || "cover";
      developingImg.style.objectPosition = photo.position || "center center";
      void developingImg.offsetWidth;
      developingImg.classList.add("developing");

      if (developingCaption) developingCaption.textContent = photo.caption || "";
      if (developingDate) developingDate.textContent = photo.date || "";
      if (developingOverlay) {
        developingOverlay.classList.add("visible");
        setTimeout(() => developingOverlay.classList.remove("visible"), 1350);
      }

      developingCard.onclick = () => openLightbox(idx);
    }

    // 3. Pin onto Album Wall if not yet added
    if (!printedSet.has(idx) && galleryGrid) {
      printedSet.add(idx);
      if (albumWallHeader) albumWallHeader.style.display = "block";
      const card = createPolaroidCard(photo, idx, true);
      galleryGrid.appendChild(card);
    }

    updateCameraStatus();
    spawnKissHearts(8);

    setTimeout(() => {
      isShooting = false;
    }, 650);
  }

  function printAllPhotos() {
    if (!galleryGrid) return;
    if (albumWallHeader) albumWallHeader.style.display = "block";
    photos.forEach((photo, idx) => {
      if (!printedSet.has(idx)) {
        printedSet.add(idx);
        const card = createPolaroidCard(photo, idx, true);
        galleryGrid.appendChild(card);
      }
    });
    shotIndex = photos.length;
    updateCameraStatus();
    spawnKissHearts(16);
  }

  if (shutterBtn) shutterBtn.addEventListener("click", shootNextPhoto);
  if (instaxLens) instaxLens.addEventListener("click", shootNextPhoto);
  if (shootCtaBtn) shootCtaBtn.addEventListener("click", shootNextPhoto);
  if (printAllBtn) printAllBtn.addEventListener("click", printAllPhotos);

  updateCameraStatus();

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
  // 5B. INTERACTIVE SCRATCH CARD ("THẺ CÀO BÍ MẬT")
  // ==========================================================================
  const scratchCanvas = document.getElementById("scratch-canvas");
  const scratchContainer = document.getElementById("scratch-container");
  const scratchProgressText = document.getElementById("scratch-progress-text");
  const scratchResetBtn = document.getElementById("scratch-reset-btn");
  let isScratching = false;
  let scratchRevealed = false;
  let lastScratchPt = null;

  function drawScratchCover() {
    if (!scratchCanvas || !scratchContainer) return;
    const rect = scratchContainer.getBoundingClientRect();
    const w = Math.max(300, Math.floor(rect.width || 380));
    const h = Math.max(340, Math.floor(rect.height || 360));
    scratchCanvas.width = w;
    scratchCanvas.height = h;

    const sctx = scratchCanvas.getContext("2d");
    sctx.globalCompositeOperation = "source-over";

    // Metallic Rose-Gold & Silver Shimmer Gradient
    const grad = sctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#f4acb7");
    grad.addColorStop(0.25, "#ffcad4");
    grad.addColorStop(0.5, "#fde2e4");
    grad.addColorStop(0.75, "#f4acb7");
    grad.addColorStop(1, "#e5989b");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, w, h);

    // Decorative Sparkle Dots on Foil
    for (let i = 0; i < 65; i++) {
      sctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.7)" : "rgba(201, 24, 74, 0.18)";
      sctx.beginPath();
      sctx.arc(Math.random() * w, Math.random() * h, 1.5 + Math.random() * 3, 0, Math.PI * 2);
      sctx.fill();
    }

    // Inner Dashed Border
    sctx.strokeStyle = "rgba(128, 15, 47, 0.35)";
    sctx.lineWidth = 2;
    sctx.setLineDash([8, 6]);
    sctx.strokeRect(16, 16, w - 32, h - 32);
    sctx.setLineDash([]);

    // Center Call-to-Action Text
    sctx.fillStyle = "#800f2f";
    sctx.font = "bold 22px 'Be Vietnam Pro', sans-serif";
    sctx.textAlign = "center";
    sctx.fillText(cfg.scratchCoverText || "✨ CÀO NHẸ TẠI ĐÂY ✨", w / 2, h / 2 - 8);

    sctx.fillStyle = "#9e2a5b";
    sctx.font = "500 14px 'Be Vietnam Pro', sans-serif";
    sctx.fillText(cfg.scratchCoverSubtext || "Dùng ngón tay hoặc chuột vuốt qua lại 💌", w / 2, h / 2 + 22);

    scratchCanvas.classList.remove("revealed");
    scratchRevealed = false;
    if (scratchProgressText) scratchProgressText.textContent = "Đã cào: 0%";
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const scaleX = scratchCanvas.width / rect.width;
    const scaleY = scratchCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function checkScratchPercent() {
    if (!scratchCanvas || scratchRevealed) return;
    const sctx = scratchCanvas.getContext("2d");
    const { width, height } = scratchCanvas;
    const imgData = sctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    const step = 16; // sample every 4th pixel for fast performance
    const totalSampled = Math.floor(imgData.length / step);

    for (let i = 3; i < imgData.length; i += step) {
      if (imgData[i] < 128) cleared++;
    }

    const pct = Math.min(100, Math.round((cleared / totalSampled) * 100));
    if (scratchProgressText) {
      scratchProgressText.textContent = `Đã cào: ${pct}%`;
    }

    if (pct >= 46 && !scratchRevealed) {
      scratchRevealed = true;
      scratchCanvas.classList.add("revealed");
      if (scratchProgressText) {
        scratchProgressText.textContent = "🎉 Đã mở khoá bí mật 100%! 💖";
      }
      spawnKissHearts(24);
    }
  }

  function scratchAt(pt) {
    if (!scratchCanvas || scratchRevealed) return;
    const sctx = scratchCanvas.getContext("2d");
    sctx.globalCompositeOperation = "destination-out";
    sctx.lineWidth = 46;
    sctx.lineCap = "round";
    sctx.lineJoin = "round";

    sctx.beginPath();
    if (lastScratchPt) {
      sctx.moveTo(lastScratchPt.x, lastScratchPt.y);
      sctx.lineTo(pt.x, pt.y);
    } else {
      sctx.arc(pt.x, pt.y, 23, 0, Math.PI * 2);
    }
    sctx.stroke();
    lastScratchPt = pt;
  }

  function initScratchCard() {
    if (!scratchCanvas) return;
    drawScratchCover();
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener("pointerdown", (e) => {
      isScratching = true;
      lastScratchPt = null;
      scratchAt(getScratchCoords(e));
    });

    let scratchMoveTicks = 0;
    scratchCanvas.addEventListener("pointermove", (e) => {
      if (!isScratching) return;
      scratchAt(getScratchCoords(e));
      scratchMoveTicks++;
      if (scratchMoveTicks % 10 === 0) {
        checkScratchPercent();
      }
    });

    const endScratch = () => {
      if (!isScratching) return;
      isScratching = false;
      lastScratchPt = null;
      checkScratchPercent();
    };

    window.addEventListener("pointerup", endScratch);
    window.addEventListener("pointercancel", endScratch);
  }

  if (scratchResetBtn) {
    scratchResetBtn.addEventListener("click", () => {
      drawScratchCover();
    });
  }

  // ==========================================================================
  // 5C. INTERACTIVE WISH STAR JAR ("LỌ SAO TÂM SỰ")
  // ==========================================================================
  const glassJarBtn = document.getElementById("glass-jar-btn");
  const jarNoteCard = document.getElementById("jar-note-card");
  const jarNoteBadge = document.getElementById("jar-note-badge");
  const jarNoteText = document.getElementById("jar-note-text");
  const jarNotes = cfg.jarNotes || [];
  let currentJarIdx = 0;

  function pickNextStarNote() {
    if (!jarNotes.length) return;
    if (glassJarBtn) {
      glassJarBtn.classList.remove("shaking");
      void glassJarBtn.offsetWidth;
      glassJarBtn.classList.add("shaking");
    }

    const note = jarNotes[currentJarIdx % jarNotes.length];
    const displayNum = (currentJarIdx % jarNotes.length) + 1;
    currentJarIdx++;

    if (jarNoteBadge) {
      jarNoteBadge.textContent = `🌟 Ngôi sao #${displayNum} / ${jarNotes.length}`;
    }
    if (jarNoteText) {
      jarNoteText.textContent = note;
    }
    if (jarNoteCard) {
      jarNoteCard.classList.remove("pop");
      void jarNoteCard.offsetWidth;
      jarNoteCard.classList.add("pop");
    }
    spawnKissHearts(8);
  }

  if (glassJarBtn) {
    glassJarBtn.addEventListener("click", pickNextStarNote);
  }
  if (jarNoteCard) {
    jarNoteCard.style.cursor = "pointer";
    jarNoteCard.addEventListener("click", pickNextStarNote);
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
