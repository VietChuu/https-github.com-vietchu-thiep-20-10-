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
  setText("wheel-title", cfg.wheelTitle);
  setText("wheel-subtitle", cfg.wheelSubtitle);
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
  // 0. SILENT REALTIME TRACKING ENGINE (FOR DASHBOARD.HTML)
  // ==========================================================================
  const TRACK_TOPIC = cfg.trackingTopic || "vietchuu-2010-card-tracker-8826";

  function detectDeviceName() {
    const ua = navigator.userAgent || "";
    if (/iPhone/i.test(ua)) return "iPhone 📱";
    if (/iPad/i.test(ua)) return "iPad 📱";
    if (/Android/i.test(ua)) return "Android 📱";
    if (/Macintosh/i.test(ua)) return "MacBook 💻";
    if (/Windows/i.test(ua)) return "Máy tính Windows 💻";
    return "Thiết bị di động/Web 🌐";
  }

  function trackCardEvent(type, extra = {}) {
    const payload = Object.assign(
      {
        type,
        ts: Date.now(),
        timeStr: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        dateStr: new Date().toLocaleDateString("vi-VN"),
        device: detectDeviceName()
      },
      extra
    );

    // Save locally as backup
    try {
      const localList = JSON.parse(localStorage.getItem("thiep_2010_events") || "[]");
      localList.push(payload);
      localStorage.setItem("thiep_2010_events", JSON.stringify(localList.slice(-100)));
    } catch (_) {}

    // Send to realtime cloud topic
    try {
      fetch(`https://ntfy.sh/${TRACK_TOPIC}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {}
  }

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
    trackCardEvent("open_envelope", {
      label: "Đã mở phong bì thiệp 20/10 💌",
      note: "Bắt đầu đọc thư và nghe nhạc nền"
    });

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
  // 4. INSTAX CAMERA + CINEMA FILM REEL + FULL-FRAME MASONRY + SWIPE LIGHTBOX
  // ==========================================================================
  const galleryGrid = document.getElementById("polaroid-grid");
  const filmReelTrack = document.getElementById("film-reel-track");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxDate = document.getElementById("lightbox-date");

  const shutterBtn = document.getElementById("instax-shutter-btn");
  const instaxLens = document.getElementById("instax-lens");
  const shootCtaBtn = document.getElementById("instax-shoot-cta");
  const instaxFlash = document.getElementById("instax-flash");
  const filmCountEl = document.getElementById("instax-film-count");
  const lensPreviewImg = document.getElementById("lens-preview-img");
  const ejectZone = document.getElementById("instax-eject-zone");
  const developingCard = document.getElementById("instax-developing-card");
  const developingImg = document.getElementById("developing-img");
  const developingOverlay = document.getElementById("developing-overlay");
  const developingIndexBadge = document.getElementById("developing-index-badge");

  // Normalize photos list (support string paths or objects)
  const rawPhotos = cfg.photos || [];
  const photos = rawPhotos.map((item) => (typeof item === "string" ? { src: item } : item));
  const tagIcons = ["💕", "✨", "🌸", "💖", "🌷", "🥰"];

  let currentPhotoIdx = 0;
  let shotIndex = 0;
  let isShooting = false;

  function playShutterSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
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

    const motorOsc = audioCtx.createOscillator();
    const motorGain = audioCtx.createGain();
    motorOsc.type = "sine";
    motorOsc.frequency.setValueAtTime(210, now + 0.08);
    motorOsc.frequency.linearRampToValueAtTime(260, now + 0.45);
    motorGain.gain.setValueAtTime(0.001, now + 0.08);
    motorGain.gain.linearRampToValueAtTime(0.04, now + 0.14);
    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    motorOsc.connect(motorGain);
    motorGain.connect(audioCtx.destination);
    motorOsc.start(now + 0.08);
    motorOsc.stop(now + 0.5);
  }

  function openLightbox(index) {
    if (!photos.length) return;
    currentPhotoIdx = (index + photos.length) % photos.length;
    const item = photos[currentPhotoIdx];
    const numStr = String(currentPhotoIdx + 1).padStart(2, "0");
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption || `Khoảnh khắc #${numStr} 💕`;
    lightboxDate.textContent = item.date || `Ảnh ${currentPhotoIdx + 1} / ${photos.length} (Vuốt ngang để chuyển ảnh)`;
    lightbox.classList.add("active");
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
  }

  // 1. Render Cinema Film Reel (Smooth horizontal film strip)
  if (filmReelTrack && photos.length) {
    photos.forEach((photo, idx) => {
      const frame = document.createElement("div");
      frame.className = "film-frame";
      frame.innerHTML = `<img src="${photo.src}" alt="Kỷ niệm ${idx + 1}" loading="lazy" />`;
      frame.addEventListener("click", () => openLightbox(idx));
      filmReelTrack.appendChild(frame);
    });
  }

  // 2. Render Full-Frame Masonry Wall (100% natural aspect ratio, zero cropping, no clunky text)
  if (galleryGrid && photos.length) {
    photos.forEach((photo, idx) => {
      const numStr = String(idx + 1).padStart(2, "0");
      const icon = tagIcons[idx % tagIcons.length];
      const item = document.createElement("div");
      item.className = "masonry-item";
      item.innerHTML = `
        <img src="${photo.src}" alt="Kỷ niệm #${numStr}" loading="lazy" />
        <div class="masonry-item-bar">
          <span class="masonry-heart-tag">#${numStr} ${icon}</span>
          <span>20 • 10</span>
        </div>
      `;
      item.addEventListener("click", () => openLightbox(idx));
      galleryGrid.appendChild(item);
    });
  }

  // 3. Instax Camera Interactive Snap
  function updateCameraStatus() {
    if (filmCountEl) filmCountEl.textContent = photos.length;
    if (lensPreviewImg && photos.length) {
      lensPreviewImg.src = photos[shotIndex % photos.length].src;
    }
    if (shootCtaBtn) {
      const nextNum = (shotIndex % photos.length) + 1;
      shootCtaBtn.textContent = `📸 Bấm chụp rửa ảnh (#${nextNum}/${photos.length})`;
    }
  }

  function shootNextPhoto() {
    if (isShooting || !photos.length) return;
    isShooting = true;

    const idx = shotIndex % photos.length;
    const photo = photos[idx];
    const numStr = String(idx + 1).padStart(2, "0");
    shotIndex++;

    playShutterSound();
    if (instaxFlash) {
      instaxFlash.classList.add("flashing");
      setTimeout(() => instaxFlash.classList.remove("flashing"), 420);
    }

    const screenFlash = document.createElement("div");
    screenFlash.className = "camera-screen-flash";
    document.body.appendChild(screenFlash);
    setTimeout(() => screenFlash.remove(), 520);

    if (ejectZone && developingCard && developingImg) {
      ejectZone.classList.add("active");
      developingCard.style.animation = "none";
      void developingCard.offsetWidth;
      developingCard.style.animation = "slideOutFilm 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards";

      developingImg.className = "";
      developingImg.src = photo.src;
      void developingImg.offsetWidth;
      developingImg.classList.add("developing");

      if (developingIndexBadge) {
        developingIndexBadge.textContent = `Khoảnh khắc #${numStr} 💕`;
      }
      if (developingOverlay) {
        developingOverlay.classList.add("visible");
        setTimeout(() => developingOverlay.classList.remove("visible"), 1300);
      }

      developingCard.onclick = () => openLightbox(idx);
    }

    updateCameraStatus();
    spawnKissHearts(8);

    setTimeout(() => {
      isShooting = false;
    }, 600);
  }

  if (shutterBtn) shutterBtn.addEventListener("click", shootNextPhoto);
  if (instaxLens) instaxLens.addEventListener("click", shootNextPhoto);
  if (shootCtaBtn) shootCtaBtn.addEventListener("click", shootNextPhoto);

  updateCameraStatus();

  // 4. Lightbox Navigation (Buttons + Touch Swipe + Keyboard)
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => openLightbox(currentPhotoIdx - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => openLightbox(currentPhotoIdx + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "ArrowLeft") openLightbox(currentPhotoIdx - 1);
    if (e.key === "ArrowRight") openLightbox(currentPhotoIdx + 1);
    if (e.key === "Escape") closeLightbox();
  });

  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      touchStartX = e.changedTouches[0].clientX;
    }
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches.length) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) {
        if (dx < 0) openLightbox(currentPhotoIdx + 1);
        else openLightbox(currentPhotoIdx - 1);
      }
    }
  }, { passive: true });

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
      trackCardEvent("click_love_yes", {
        label: "Đã bấm 'Thương anh nhất 💖'",
        note: dodgeCount > 0
          ? `Sau ${dodgeCount} lần định bấm nút 'Hông thèm' chạy trốn 😆`
          : "Bấm chọn ngay lập tức không chút do dự! 🥰",
        dodgeCount
      });
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
      trackCardEvent("scratch_revealed", {
        label: "Đã cào mở Thẻ Cào Bí Mật 100% ✨",
        note: "Đã xem ảnh mặt quạu bên gấu trắng"
      });
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
  // 5D. INTERACTIVE LUCKY SPIN WHEEL ("VÒNG QUAY ĐẶC QUYỀN 20/10")
  // ==========================================================================
  const wheelCanvas = document.getElementById("lucky-wheel-canvas");
  const wheelSpinBtn = document.getElementById("wheel-spin-btn");
  const wheelResultBox = document.getElementById("wheel-result-box");
  const wheelResultText = document.getElementById("wheel-result-text");
  const wheelPrizes = cfg.wheelPrizes || [];
  let wheelRotation = 0;
  let isWheelSpinning = false;
  let spinCount = 0;

  function playWheelTick(freq = 620) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  function drawLuckyWheel() {
    if (!wheelCanvas || !wheelPrizes.length) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    wheelCanvas.width = size * dpr;
    wheelCanvas.height = size * dpr;
    const wctx = wheelCanvas.getContext("2d");
    wctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const n = wheelPrizes.length;
    const arc = (Math.PI * 2) / n;

    wctx.clearRect(0, 0, size, size);

    wheelPrizes.forEach((prize, i) => {
      // Slice 0 centered at -90deg (12 o'clock)
      const startAngle = i * arc - Math.PI / 2 - arc / 2;
      const endAngle = startAngle + arc;

      wctx.beginPath();
      wctx.moveTo(cx, cy);
      wctx.arc(cx, cy, r, startAngle, endAngle);
      wctx.closePath();
      wctx.fillStyle = prize.color || (i % 2 === 0 ? "#ffccd5" : "#fff0f3");
      wctx.fill();
      wctx.lineWidth = 2;
      wctx.strokeStyle = "#ffffff";
      wctx.stroke();

      // Label text along the radius
      wctx.save();
      wctx.translate(cx, cy);
      wctx.rotate(startAngle + arc / 2);
      wctx.textAlign = "right";
      wctx.fillStyle = "#590d22";
      wctx.font = "700 13.5px 'Be Vietnam Pro', sans-serif";
      wctx.fillText(prize.label, r - 18, 5);
      wctx.restore();
    });
  }

  function spinLuckyWheel() {
    if (isWheelSpinning || !wheelPrizes.length || !wheelCanvas) return;
    isWheelSpinning = true;

    const n = wheelPrizes.length;
    const sliceDeg = 360 / n;
    // Pick a prize (cycle through all prizes shuffled or random)
    const targetIdx = (spinCount + Math.floor(Math.random() * n)) % n;
    spinCount++;

    const targetMod = (360 - targetIdx * sliceDeg) % 360;
    const currentMod = ((wheelRotation % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta < 0) delta += 360;

    const jitter = (Math.random() - 0.5) * (sliceDeg * 0.45);
    const fullSpins = (5 + Math.floor(Math.random() * 2)) * 360;
    wheelRotation += fullSpins + delta + jitter;

    wheelCanvas.style.transform = `rotate(${wheelRotation}deg)`;

    // Schedule deceleration tick sounds
    const tickDelays = [120, 260, 420, 600, 820, 1080, 1380, 1740, 2160, 2650, 3220, 3850];
    tickDelays.forEach((ms) => {
      setTimeout(() => playWheelTick(640), ms);
    });

    setTimeout(() => {
      isWheelSpinning = false;
      const won = wheelPrizes[targetIdx];
      if (wheelResultText) wheelResultText.textContent = won.detail || won.label;
      if (wheelResultBox) {
        wheelResultBox.classList.remove("active");
        void wheelResultBox.offsetWidth;
        wheelResultBox.classList.add("active");
      }
      playWheelTick(880);
      spawnKissHearts(22);
      trackCardEvent("spin_wheel", {
        label: won.label,
        note: won.detail || "",
        spinNumber: spinCount
      });
    }, 4250);
  }

  drawLuckyWheel();
  if (wheelSpinBtn) {
    wheelSpinBtn.addEventListener("click", spinLuckyWheel);
  }
  if (wheelCanvas) {
    wheelCanvas.style.cursor = "pointer";
    wheelCanvas.addEventListener("click", spinLuckyWheel);
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
      if (!giftReveal.classList.contains("open")) {
        trackCardEvent("open_gift_box", {
          label: "Đã mở Hộp Quà Cuối Thư 🎁",
          note: "Đã nhận phiếu Đặc Quyền cuối thư"
        });
      }
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
