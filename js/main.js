/* ============================================================
   Elara Voss — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("is-done"), 1100);
  });

  /* ---------- Sticky nav ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav.classList.toggle("is-stuck", window.scrollY > 40);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Scroll progress ---------- */
  const progress = document.getElementById("scrollProgress");
  const onScrollProgress = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScrollProgress, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const toggleMenu = (open) => {
    const isOpen = open ?? !burger.classList.contains("is-open");
    burger.classList.toggle("is-open", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleMenu());
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- Custom cursor ---------- */
  if (canHover) {
    const cursor = document.getElementById("cursor");
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    const render = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    render();
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.classList.remove("is-hover", "is-view");
      if (t) {
        const mode = t.getAttribute("data-cursor");
        cursor.classList.add(mode === "view" ? "is-view" : "is-hover");
      }
    });
    document.addEventListener("mouseleave", () => (cursor.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (cursor.style.opacity = "1"));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal, .reveal-line, .reveal-words");
  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Split statement into animated words ---------- */
  document.querySelectorAll(".reveal-words").forEach((el) => {
    // Wrap each plain-text word in a span so it can be staggered in.
    const walk = (node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3 && child.textContent.trim()) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (part.trim()) {
              const span = document.createElement("span");
              span.className = "word-span";
              span.textContent = part;
              frag.appendChild(span);
            } else {
              frag.appendChild(document.createTextNode(part));
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    let d = 0;
    el.querySelectorAll(".word-span").forEach((s) => {
      s.style.transitionDelay = (d += 0.03) + "s";
    });
  });

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat__num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      const plus = el.nextElementSibling;
      if (p < 1) requestAnimationFrame(tick);
      else if (plus && plus.classList.contains("stat__plus")) plus.style.display = "inline";
    };
    requestAnimationFrame(tick);
  };
  if (reduceMotion) {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  } else {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Parallax accent blobs ---------- */
  if (!reduceMotion) {
    const blobs = document.querySelectorAll(".blob");
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        b.style.transform = `translateY(${y * (i ? 0.12 : 0.06)}px)`;
      });
    }, { passive: true });
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || !message) {
        status.textContent = "Please add your name, a valid email and a short message.";
        status.style.color = "#FF8A5B";
        return;
      }
      status.style.color = "var(--accent)";
      status.textContent = `Thanks, ${name.split(" ")[0]} — your enquiry is on its way. I’ll reply within 48 hours.`;
      form.reset();
    });
  }

  /* ---------- Active nav link highlight ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav__links a');
  if (sections.length && navLinks.length) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((l) => l.style.color = l.getAttribute("href") === "#" + id ? "var(--accent)" : "");
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => so.observe(s));
  }
})();
