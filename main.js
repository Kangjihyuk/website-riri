// ── FLOATING DOTS ──
const dotsEl = document.getElementById("dots");
for (let i = 0; i < 18; i++) {
  const d = document.createElement("div");
  d.className = "dot";
  const size = Math.random() * 24 + 8;
  d.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    animation-duration:${Math.random() * 14 + 10}s;
    animation-delay:${Math.random() * 12}s;
  `;
  dotsEl.appendChild(d);
}

// ── THEME TOGGLE ──
const themeToggle = document.getElementById("themeToggle");
const toggleThumb = document.getElementById("toggleThumb");
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem("bw-theme");
if (savedTheme === "dark") {
  htmlEl.setAttribute("data-theme", "dark");
  themeToggle.checked = true;
  toggleThumb.textContent = "🌙";
}
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    htmlEl.setAttribute("data-theme", "dark");
    toggleThumb.textContent = "🌙";
    localStorage.setItem("bw-theme", "dark");
  } else {
    htmlEl.setAttribute("data-theme", "light");
    toggleThumb.textContent = "☀️";
    localStorage.setItem("bw-theme", "light");
  }
});

// ── HAMBURGER ──
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
let menuOpen = false;

hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle("open", menuOpen);
  mobileMenu.classList.toggle("open", menuOpen);
  hamburger.setAttribute("aria-expanded", String(menuOpen));
});
mobileMenu.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    menuOpen = false;
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

// ── SCROLL SHRINK ──
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  },
  { passive: true },
);

// ── ACTIVE LINK ──
document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((link) => {
  link.addEventListener("click", function () {
    if (!this.classList.contains("cta-btn")) {
      document
        .querySelectorAll(".nav-links a, .mobile-menu a")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(
          `.nav-links a[href="${this.getAttribute("href")}"],
         .mobile-menu a[href="${this.getAttribute("href")}"]`,
        )
        .forEach((l) => l.classList.add("active"));
    }
  });
});

// ── SLIDER ──
const SLIDE_DURATION = 3000;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".sdot");
const progressFill = document.getElementById("progressFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentIndex = 0;
let autoTimer = null;

function goTo(index) {
  const total = slides.length;
  currentIndex = ((index % total) + total) % total;
  slides.forEach((s, i) => s.classList.toggle("active", i === currentIndex));
  dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  resetProgress();
}
function goNext() {
  goTo(currentIndex + 1);
}
function goPrev() {
  goTo(currentIndex - 1);
}
function resetProgress() {
  progressFill.style.transition = "none";
  progressFill.style.width = "0%";
  progressFill.getBoundingClientRect();
  progressFill.style.transition = `width ${SLIDE_DURATION}ms linear`;
  progressFill.style.width = "100%";
}
function startAuto() {
  stopAuto();
  autoTimer = setInterval(goNext, SLIDE_DURATION);
}
function stopAuto() {
  clearInterval(autoTimer);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    goTo(Number(dot.dataset.index));
    startAuto();
  });
});
prevBtn.addEventListener("click", () => {
  goPrev();
  startAuto();
});
nextBtn.addEventListener("click", () => {
  goNext();
  startAuto();
});

const sliderEl = document.querySelector(".slider");
sliderEl.addEventListener("mouseenter", stopAuto);
sliderEl.addEventListener("mouseleave", startAuto);

let touchStartX = 0;
sliderEl.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].clientX;
  },
  { passive: true },
);
sliderEl.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
      startAuto();
    }
  },
  { passive: true },
);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    goPrev();
    startAuto();
  }
  if (e.key === "ArrowRight") {
    goNext();
    startAuto();
  }
});

goTo(0);
startAuto();

// ── CARD SCROLL ANIMATION ──
const cards = document.querySelectorAll(".glass-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // delay tiap card biar muncul berurutan
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, i * 150);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

cards.forEach((card) => observer.observe(card));
