const nameScreen       = document.getElementById("nameScreen");
const guestInput       = document.getElementById("guestInput");
const guestSubmitBtn   = document.getElementById("guestSubmitBtn");
const guestNameDisplay = document.getElementById("guestNameDisplay");
const sideBadgeDisplay = document.getElementById("sideBadgeDisplay");
const mainScene        = document.getElementById("mainScene");
const invitationBook   = document.getElementById("invitationBook");
const openCardBtn      = document.getElementById("openCardBtn");
const closeCardBtn     = document.getElementById("closeCardBtn");
const playMusicBtn     = document.getElementById("playMusicBtn");
const bgMusic          = document.getElementById("bgMusic");
const groomSideBtn     = document.getElementById("groomSideBtn");
const brideSideBtn     = document.getElementById("brideSideBtn");
const sprinkleCanvas   = document.getElementById("sprinkleCanvas");

let musicPlaying = false;
let selectedSide = null;

groomSideBtn.addEventListener("click", () => {
  selectedSide = "groom";
  groomSideBtn.classList.add("selected");
  brideSideBtn.classList.remove("selected");
});

brideSideBtn.addEventListener("click", () => {
  selectedSide = "bride";
  brideSideBtn.classList.add("selected");
  groomSideBtn.classList.remove("selected");
});

function launchSprinkles() {
  const emojis = ["🌸", "🌺", "✦", "🌼", "💕", "🎊", "✨", "🌹", "💐", "🎉", "🪔", "🌷"];
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("span");
    el.className = "sprinkle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (Math.random() * 100) + "vw";
    el.style.top = "-50px";
    el.style.fontSize = (1 + Math.random() * 1.4) + "rem";
    el.style.animationDelay = (Math.random() * 1.8) + "s";
    el.style.animationDuration = (2 + Math.random() * 1.6) + "s";
    sprinkleCanvas.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 5000);
  }
}

function tryPlayMusic() {
  bgMusic.volume = 0.55;
  bgMusic.play()
    .then(() => {
      musicPlaying = true;
      playMusicBtn.textContent = "⏸  Pause Music";
    })
    .catch(() => {
      musicPlaying = false;
      playMusicBtn.textContent = "▶  Play Music";
    });
}

function showEnvelope(onDone) {
  const wrap = document.getElementById('envWrap');
  wrap.style.display = 'flex';
  // double rAF ensures display:flex is painted before transitions fire
  requestAnimationFrame(() => requestAnimationFrame(() => {
    wrap.classList.add('env-appear');
  }));
  setTimeout(() => wrap.classList.add('env-open'),    650);
  setTimeout(() => wrap.classList.add('env-release'), 1450);
  setTimeout(() => {
    wrap.classList.add('env-gone');
    setTimeout(() => {
      wrap.style.display = 'none';
      wrap.className = '';
      onDone();
    }, 720);
  }, 2350);
}

function openInvitation() {
  const raw = guestInput.value.trim();
  if (!raw) {
    guestInput.classList.add("error");
    guestInput.placeholder = "Please enter your name…";
    guestInput.focus();
    return;
  }

  guestNameDisplay.textContent = raw;

  if (selectedSide === "groom") {
    sideBadgeDisplay.textContent = "( बेहुला पट्टिको — Groom's Side )";
  } else if (selectedSide === "bride") {
    sideBadgeDisplay.textContent = "( बेहुली पट्टिको — Bride's Side )";
  } else {
    sideBadgeDisplay.textContent = "";
  }

  tryPlayMusic();

  nameScreen.classList.add("fade-out");
  setTimeout(() => {
    nameScreen.style.display = "none";
    showEnvelope(() => {
      mainScene.classList.add("visible");
      launchSprinkles();
      animateCoverPage();
    });
  }, 860);
}

guestSubmitBtn.addEventListener("click", openInvitation);
guestInput.addEventListener("keydown", (e) => { if (e.key === "Enter") openInvitation(); });
guestInput.addEventListener("input", () => { guestInput.classList.remove("error"); });

// open/close handled below with reveal logic

playMusicBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      playMusicBtn.textContent = "⏸  Pause Music";
    });
  } else {
    bgMusic.pause();
    playMusicBtn.textContent = "▶  Play Music";
    musicPlaying = false;
  }
});

function setupPhotoUpload(frameId, inputId, imgId) {
  const frame = document.getElementById(frameId);
  const input = document.getElementById(inputId);
  const img   = document.getElementById(imgId);
  if (!frame || !input || !img) return;
  frame.addEventListener("click", () => input.click());
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { img.src = ev.target.result; };
    reader.readAsDataURL(file);
  });
}

setupPhotoUpload("photo1Frame", "photo1Input", "photo1Img");
setupPhotoUpload("photo2Frame", "photo2Input", "photo2Img");

const weddingDate = new Date("2026-06-23T11:15:00Z").getTime();
const daysEl    = document.getElementById("days");
const hoursEl   = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  const diff = weddingDate - Date.now();
  if (diff <= 0) {
    [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = "00"; });
    clearInterval(countdownTimer);
    return;
  }
  if (daysEl)    daysEl.textContent    = pad(Math.floor(diff / 86400000));
  if (hoursEl)   hoursEl.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
  if (minutesEl) minutesEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
  if (secondsEl) secondsEl.textContent = pad(Math.floor((diff % 60000) / 1000));
}

updateCountdown();
const countdownTimer = setInterval(updateCountdown, 1000);

function splitLetters(el, baseDelay, gap) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'ls';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.animationDelay = (baseDelay + i * gap) + 'ms';
    el.appendChild(s);
  });
}

function splitWords(el, baseDelay, gap) {
  if (!el) return;
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = words.map((w, i) =>
    `<span class="ws" style="animation-delay:${baseDelay + i * gap}ms">${w}</span>`
  ).join(' ');
}

function revealPhotoRing(circleEl, imgEl, delay) {
  setTimeout(() => {
    if (circleEl) circleEl.classList.add('drawn');
    setTimeout(() => {
      if (imgEl) imgEl.classList.add('photo-reveal');
    }, 1300);
  }, delay);
}

function revealFramedImage(rectEl, imgEl, delay) {
  setTimeout(() => {
    if (rectEl) {
      // Get actual perimeter from rendered size
      const w = rectEl.closest('.couple-banner, .venue-card')?.offsetWidth || 300;
      const h = rectEl.closest('.couple-banner, .venue-card')?.offsetHeight || 150;
      const perimeter = 2 * (w + h);
      rectEl.style.strokeDasharray = perimeter;
      rectEl.style.strokeDashoffset = perimeter;
      rectEl.classList.add('drawn');
    }
    setTimeout(() => {
      if (imgEl) imgEl.classList.add('photo-reveal');
    }, 1400);
  }, delay);
}

/* ── Loading Screen ─────────────────────────────────── */
window.addEventListener('load', () => {
  const ls = document.getElementById('loadingScreen');
  if (!ls) return;
  setTimeout(() => {
    ls.classList.add('ldg-done');
    setTimeout(() => { ls.style.display = 'none'; }, 900);
  }, 2500);
});

/* ── Cover Page: photo rings draw + reveal on scene reveal ── */
function animateCoverPage() {
  setTimeout(() => {
    revealPhotoRing(document.getElementById('ring1'), document.querySelector('#photo1Img'), 0);
    revealPhotoRing(document.getElementById('ring2'), document.querySelector('#photo2Img'), 600);
  }, 800);
}

/* ── Inside Panel: animate on card open ──────────────── */
function animateInsidePanel() {
  // Heading letter by letter
  splitLetters(document.getElementById('panelHeadingEl'), 200, 55);

  // Invite body word by word
  splitWords(document.getElementById('inviteBodyEl'), 600, 48);

  // Banner sketch → photo
  revealFramedImage(
    document.getElementById('bannerRect'),
    document.getElementById('bannerImg'),
    400
  );

  // Venue sketch → photo
  revealFramedImage(
    document.getElementById('venueRect'),
    document.getElementById('venueImg'),
    800
  );
}

/* ── Fireflies ───────────────────────────────────────── */
(function spawnFireflies() {
  const canvas = document.getElementById("fireflyCanvas");
  if (!canvas) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const f = document.createElement("div");
    f.className = "firefly";
    const size = 4 + Math.random() * 6;
    const dx  = (Math.random() - 0.5) * 120;
    const dy  = (Math.random() - 0.5) * 120;
    const dx2 = (Math.random() - 0.5) * 160;
    const dy2 = (Math.random() - 0.5) * 160;
    const dur = 5 + Math.random() * 8;
    f.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}vw;
      top:${Math.random()*100}vh;
      --dx:${dx}px; --dy:${dy}px;
      --dx2:${dx2}px; --dy2:${dy2}px;
      animation-duration:${dur}s;
      animation-delay:${Math.random()*dur}s;
    `;
    canvas.appendChild(f);
  }
})();

/* ── Scroll Reveal ───────────────────────────────────── */
function triggerReveal() {
  document.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), i * 120);
  });
}

openCardBtn.addEventListener("click", () => {
  invitationBook.classList.add("open");
  setTimeout(triggerReveal, 900);
  setTimeout(animateInsidePanel, 1100);
});

closeCardBtn.addEventListener("click", () => {
  invitationBook.classList.remove("open");
  document.querySelectorAll(".reveal").forEach(el => el.classList.remove("visible"));
  // Reset sketch/ring animations so re-open re-animates
  document.querySelectorAll(".sketch-img").forEach(img => img.classList.remove("photo-reveal"));
  document.querySelectorAll(".ring-draw-circle, .sketch-frame-rect").forEach(el => el.classList.remove("drawn"));
  const heading = document.getElementById('panelHeadingEl');
  if (heading) heading.textContent = 'You Are Cordially Invited';
  const body = document.getElementById('inviteBodyEl');
  if (body) {
    body.innerHTML = 'हर्षले भरिएका हृदयसँगै, हामी तपाईंलाई हाम्रो विवाह उत्सवको यस शुभ अवसरमा उपस्थित हुन हार्दिक निमन्त्रणा गर्दछौं। तपाईंको आशीर्वाद र स्नेहपूर्ण उपस्थितिले यो सुन्दर दिनलाई हाम्रा लागि साँच्चै सम्पूर्ण र सदा स्मरणीय बनाउनेछ।';
  }
});