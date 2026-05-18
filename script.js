const header = document.querySelector("[data-header]");
const hero = document.querySelector("[data-hero]");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const rippleButtons = document.querySelectorAll(".ripple");
const contactForm = document.querySelector(".contact-form");
let ticking = false;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateHeroScroll() {
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  const scrollRange = Math.max(1, rect.height * 0.9);
  const progress = clamp(-rect.top / scrollRange, 0, 1);
  const depth = Math.sin(progress * Math.PI);

  hero.style.setProperty("--hero-progress", progress.toFixed(3));
  hero.style.setProperty("--hero-depth", depth.toFixed(3));
  hero.style.setProperty("--hero-copy-y", `${Math.round(progress * -58)}px`);
  hero.style.setProperty("--hero-copy-opacity", `${clamp(1 - progress * 1.45, 0.18, 1).toFixed(3)}`);
  hero.style.setProperty("--hero-product-y", `${Math.round(progress * 86)}px`);
  hero.style.setProperty("--hero-product-x", `${Math.round(progress * -28)}px`);
  hero.style.setProperty("--hero-product-rotate", `${(depth * 4.5).toFixed(2)}deg`);
  hero.style.setProperty("--hero-glass-y", `${Math.round(progress * -72)}px`);
}

function updateScrollEffects() {
  const scrolled = window.scrollY > 12;
  header?.classList.toggle("is-scrolled", scrolled);
  updateHeroScroll();

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - midpoint) * 0.035;
    item.style.setProperty("--parallax-y", `${Math.max(-24, Math.min(24, offset))}px`);
  });
}

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

rippleButtons.forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
    button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
    button.classList.remove("is-rippling");
    void button.offsetWidth;
    button.classList.add("is-rippling");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button");
  if (!button) return;
  button.textContent = "Enquiry ready";
  window.setTimeout(() => {
    button.textContent = "Send enquiry";
  }, 2200);
});
