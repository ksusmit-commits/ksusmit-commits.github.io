/**
 * script.js — site logic (no dependencies).
 * Reads from the global CONTENT object (defined in content.js).
 *
 * Responsibilities:
 *  1. Render content into the HTML shells
 *  2. Theme toggle (dark/light) with localStorage persistence
 *  3. Smooth scroll and mobile nav
 *  4. Reveal-on-scroll with IntersectionObserver
 *  5. Typed terminal intro
 *  6. Back-to-top button
 *  7. Debug panel with perf metrics
 *  8. 4 easter eggs: Konami, logo clicks, sudo sparkles, console welcome
 */

(function () {
  "use strict";

  // ------------------------- helpers -------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ========================================================
  // 1. RENDER CONTENT
  // ========================================================
  function renderHero() {
    const h = CONTENT.hero;
    $(".hero__greeting").textContent = h.greeting;
    $("#hero-name").textContent = h.name;
    $(".hero__title").textContent = h.title;
    $(".hero__subtitle").textContent = h.subtitle;

    const primary = $("#cta-primary");
    primary.textContent = h.cta.primary.label;
    primary.href = h.cta.primary.href;

    const secondary = $("#cta-secondary");
    secondary.textContent = h.cta.secondary.label;
    secondary.href = h.cta.secondary.href;

    if (h.cta.tertiary) {
      const tertiary = $("#cta-tertiary");
      tertiary.textContent = h.cta.tertiary.label;
      tertiary.href = h.cta.tertiary.href;
      tertiary.style.display = "inline-flex";
      tertiary.setAttribute("download", "");
    }
  }

  function renderExperience() {
    const list = $("#experience-list");
    CONTENT.experience.forEach((job) => {
      const item = el("article", "experience__item");
      item.setAttribute("data-reveal", "");

      const logo = el("div", "experience__logo");
      logo.textContent = job.logo || job.company.slice(0, 2).toUpperCase();
      item.appendChild(logo);

      const body = el("div", "experience__body");
      body.appendChild(el("h3", "experience__role", `${job.company} — ${job.role}`));
      body.appendChild(el("p", "experience__meta", `${job.period} · ${job.location}`));

      const points = el("ul", "experience__points");
      job.points.forEach((p) => points.appendChild(el("li", "", p)));
      body.appendChild(points);

      item.appendChild(body);
      list.appendChild(item);
    });
  }

  function renderSkills() {
    const grid = $("#skills-grid");
    Object.entries(CONTENT.skills).forEach(([group, items]) => {
      const groupEl = el("div", "skills__group");
      groupEl.setAttribute("data-reveal", "");

      const title = group.replace(/_/g, " ");
      groupEl.appendChild(el("h3", "skills__group__title", title));

      const items_wrap = el("div", "skills__items");
      items.forEach((s) => {
        const chip = el("span", "skill");
        chip.textContent = `${s.icon} ${s.name}`;
        items_wrap.appendChild(chip);
      });
      groupEl.appendChild(items_wrap);
      grid.appendChild(groupEl);
    });
  }

  function renderCertifications() {
    const grid = $("#cert-grid");
    CONTENT.certifications.forEach((c) => {
      const card = c.link ? el("a", "cert") : el("div", "cert");
      card.setAttribute("data-reveal", "");
      if (c.link) {
        card.href = c.link;
        card.target = "_blank";
        card.rel = "noopener";
      }
      card.appendChild(el("div", "cert__badge", c.badge || "🏅"));
      card.appendChild(el("h3", "cert__title", c.title));
      const meta = [c.issuer, c.date, c.expires && `Expires ${c.expires}`]
        .filter(Boolean)
        .join(" · ");
      card.appendChild(el("p", "cert__meta", meta));
      grid.appendChild(card);
    });
  }

  function renderProjects() {
    const grid = $("#projects-grid");
    CONTENT.projects.forEach((p) => {
      const card = el("article", "project");
      card.setAttribute("data-reveal", "");

      card.appendChild(el("span", "project__id", p.id));
      card.appendChild(el("div", "project__icon", p.icon));
      card.appendChild(el("h3", "project__title", p.title));
      card.appendChild(el("p", "project__description", p.description));

      const tech = el("div", "project__tech");
      p.tech.forEach((t) =>
        tech.appendChild(el("span", "project__tech-tag", t))
      );
      card.appendChild(tech);

      if (p.link) {
        const a = el("a", "project__link", "View on GitHub →");
        a.href = p.link;
        a.target = "_blank";
        a.rel = "noopener";
        card.appendChild(a);
      }

      grid.appendChild(card);
    });
  }

  function renderPublications() {
    const grid = $("#publications-grid");
    CONTENT.publications.forEach((p) => {
      const card = el("article", "pub");
      card.setAttribute("data-reveal", "");
      card.appendChild(el("div", "pub__icon", p.icon));
      card.appendChild(el("h3", "pub__title", p.title));
      const ul = el("ul", "pub__items");
      p.items.forEach((item) => ul.appendChild(el("li", "", item)));
      card.appendChild(ul);
      grid.appendChild(card);
    });
  }

  function renderEducation() {
    const grid = $("#education-grid");
    if (!CONTENT.education || CONTENT.education.length === 0) {
      $("#education").style.display = "none";
      return;
    }
    CONTENT.education.forEach((e) => {
      const card = el("article", "edu");
      card.setAttribute("data-reveal", "");
      card.appendChild(el("div", "edu__icon", e.icon || "🎓"));
      card.appendChild(el("h3", "edu__degree", e.degree));
      card.appendChild(el("p", "edu__inst", e.institution));
      const metaParts = [e.grade, e.period].filter(Boolean).join(" · ");
      card.appendChild(el("p", "edu__meta", metaParts));
      grid.appendChild(card);
    });
  }

  function renderContact() {
    $("#contact-intro").textContent = CONTENT.contact.intro;
    const grid = $("#contact-grid");
    CONTENT.contact.links.forEach((l) => {
      const card = el("a", "contact__card");
      card.setAttribute("data-reveal", "");
      card.href = l.href;
      if (l.href.startsWith("http")) {
        card.target = "_blank";
        card.rel = "noopener";
      }
      card.appendChild(el("div", "contact__icon", l.icon));
      card.appendChild(el("div", "contact__label", l.label));
      card.appendChild(el("div", "contact__value", l.value));
      grid.appendChild(card);
    });
  }

  function renderFooter() {
    $("#footer-copyright").textContent = CONTENT.footer.copyright;
    $("#footer-tagline").textContent = CONTENT.footer.tagline;
  }

  function renderDebug() {
    const techWrap = $("#debug-tech");
    CONTENT.debug.builtWith.forEach((t) =>
      techWrap.appendChild(el("span", "", t))
    );
    $("#debug-a11y").textContent = CONTENT.debug.accessibility;
    $("#debug-note").textContent = CONTENT.debug.note;
  }

  // ========================================================
  // 2. THEME TOGGLE
  // ========================================================
  function initTheme() {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (systemDark ? "dark" : "light");
    applyTheme(theme);

    $("#theme-toggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = $(".nav__theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  // ========================================================
  // 3. MOBILE NAV
  // ========================================================
  function initMobileNav() {
    const toggle = $("#menu-toggle");
    const links = $(".nav__links");
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") links.classList.remove("is-open");
    });
  }

  // ========================================================
  // 4. REVEAL ON SCROLL
  // ========================================================
  function initReveal() {
    if (prefersReducedMotion) {
      $$("[data-reveal]").forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    $$("[data-reveal]").forEach((n) => io.observe(n));
  }

  // ========================================================
  // 5. TYPED TERMINAL INTRO
  // ========================================================
  function initTerminal() {
    const cmdEl = $("#terminal-command");
    const outEl = $("#terminal-output");
    const commandText = CONTENT.hero.terminalLine;
    const aboutLines = CONTENT.about;

    if (prefersReducedMotion) {
      cmdEl.textContent = commandText;
      outEl.textContent = aboutLines.join("\n");
      return;
    }

    let i = 0;
    function typeCmd() {
      if (i < commandText.length) {
        cmdEl.textContent += commandText[i++];
        setTimeout(typeCmd, 50);
      } else {
        setTimeout(typeAbout, 400);
      }
    }
    let line = 0;
    function typeAbout() {
      if (line >= aboutLines.length) {
        setTimeout(() => {
          const secret = el("p", "terminal__command");
          secret.style.color = "var(--fg-muted)";
          secret.style.opacity = "0";
          secret.style.transition = "opacity 1s ease";
          secret.textContent = "$ echo \"hire me\" | mail -s \"Let's talk\" recruiter";
          $("#terminal-output").parentNode.insertBefore(secret, $(".terminal__prompt"));
          requestAnimationFrame(() => { secret.style.opacity = "1"; });
          markEgg("terminal");
        }, 2000);
        return;
      }
      let j = 0;
      const text = aboutLines[line];
      const currentOutput = outEl.textContent;
      function typeChar() {
        if (j <= text.length) {
          outEl.textContent = currentOutput + text.slice(0, j++);
          setTimeout(typeChar, 15);
        } else {
          outEl.textContent = currentOutput + text + "\n";
          line++;
          setTimeout(typeAbout, 60);
        }
      }
      typeChar();
    }
    typeCmd();
  }

  // ========================================================
  // 6. BACK TO TOP
  // ========================================================
  function initBackToTop() {
    const btn = $("#back-to-top");
    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ========================================================
  // 7. DEBUG PANEL
  // ========================================================
  function initDebugPanel() {
    const panel = $("#debug-panel");
    const openBtn = $("#footer-info");
    const closeBtn = $("#debug-panel-close");

    function populatePerf() {
      try {
        const nav = performance.getEntriesByType("navigation")[0];
        const loadMs = nav ? Math.round(nav.loadEventEnd) : "?";
        const resources = performance.getEntriesByType("resource").length;
        const domNodes = document.getElementsByTagName("*").length;
        $("#debug-perf").innerHTML = `
          Page load: <strong>${loadMs}ms</strong> ·
          DOM elements: <strong>${domNodes}</strong> ·
          Resources: <strong>${resources}</strong>
        `;
      } catch (e) {
        $("#debug-perf").textContent = "Performance API not available.";
      }
    }

    openBtn.addEventListener("click", () => {
      populatePerf();
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
    });

    function close() {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }
    closeBtn.addEventListener("click", close);
    panel.addEventListener("click", (e) => {
      if (e.target === panel) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // ========================================================
  // 8. EASTER EGGS
  // ========================================================
  const eggs = {
    konami: false,
    logo: false,
    sudo: false,
    console: false,
    tab: false,
    rightclick: false,
    footer: false,
    terminal: false
  };

  function markEgg(id) {
    if (eggs[id]) return;
    eggs[id] = true;
    const li = $(`[data-egg="${id}"]`);
    if (li) li.classList.add("is-found");
    const found = Object.values(eggs).filter(Boolean).length;
    const tagline = $("#footer-tagline");
    if (tagline) tagline.textContent = tagline.textContent.replace(/\d+\/8/, found + "/8");
  }

  // 8a. Konami code → Matrix rain
  function initKonami() {
    const code = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let pos = 0;
    document.addEventListener("keydown", (e) => {
      const want = code[pos];
      if (e.key.toLowerCase() === want.toLowerCase()) {
        pos++;
        if (pos === code.length) {
          pos = 0;
          markEgg("konami");
          matrixRain();
        }
      } else {
        pos = 0;
      }
    });
  }

  function matrixRain() {
    if (prefersReducedMotion) {
      alert("Konami unlocked! (Matrix rain disabled — you've got reduced motion on.)");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.className = "matrix-rain";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const chars = "アイウエオカキクケコサシスセソタチツテト0123456789$#@!*<>/?";
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    let frames = 0;
    const maxFrames = 60 * 6;
    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(10, 14, 20, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#7ee787";
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frames++;
      if (frames > maxFrames) {
        clearInterval(interval);
        canvas.style.transition = "opacity 0.6s ease";
        canvas.style.opacity = 0;
        setTimeout(() => canvas.remove(), 700);
      }
    }, 40);
  }

  // 8b. Click logo 5x fast → confetti-ish burst (simple)
  function initLogoClicks() {
    const logo = $("#nav-logo");
    let clicks = 0;
    let timer;
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 1500);
      if (clicks >= 5) {
        clicks = 0;
        markEgg("logo");
        logoBurst(logo);
      }
    });
  }

  function logoBurst(origin) {
    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const symbols = ["✦", "✧", "★", "✺", "✹"];
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      s.style.left = `${cx}px`;
      s.style.top = `${cy}px`;
      s.style.color = ["#7ee787", "#58a6ff", "#f0883e"][Math.floor(Math.random() * 3)];
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 60 + Math.random() * 40;
      s.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  }

  // 8c. Type "sudo" anywhere → sparkle cursor trail for 5s
  function initSudoSparkles() {
    let buffer = "";
    let active = false;
    let handler = null;
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      buffer = (buffer + e.key.toLowerCase()).slice(-4);
      if (buffer === "sudo" && !active) {
        markEgg("sudo");
        active = true;
        handler = (ev) => {
          if (Math.random() < 0.15) spawnSparkle(ev.clientX, ev.clientY);
        };
        document.addEventListener("mousemove", handler);
        setTimeout(() => {
          active = false;
          if (handler) document.removeEventListener("mousemove", handler);
        }, 5000);
      }
    });
  }

  function spawnSparkle(x, y) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = "✨";
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }

  // 8d. Console welcome
  function initConsoleEgg() {
    const style = "color:#7ee787; font-family:monospace; font-size:14px;";
    console.log("%c# Susmit Kallurkar — ksusmit-commits.github.io", style);
    console.log("%c$ whoami", style);
    console.log("%c> Cloud Support Engineer II @ AWS. EC2 Linux. Dublin.", style);
    console.log("%c# No frameworks, no dependencies. Just HTML, CSS, JS.", style);
    console.log("%c# 8 hidden eggs. Happy hunting.", style);
    markEgg("console");
  }

  // 8e. Tab title change
  function initTabEgg() {
    const original = document.title;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.title = "👀 Come back! I miss you...";
        markEgg("tab");
      } else {
        document.title = original;
      }
    });
  }

  // 8f. Right-click toast
  function initRightClickEgg() {
    document.addEventListener("contextmenu", () => {
      markEgg("rightclick");
      const toast = el("div", "toast");
      toast.textContent = "🔍 Inspecting my code? I like your style.";
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add("is-visible"));
      setTimeout(() => {
        toast.classList.remove("is-visible");
        setTimeout(() => toast.remove(), 300);
      }, 2500);
    });
  }

  // 8g. Footer timer
  function initFooterEgg() {
    const copyright = $("#footer-copyright");
    const originalText = CONTENT.footer.copyright;
    const startTime = Date.now();
    copyright.addEventListener("mouseenter", () => {
      markEgg("footer");
      const secs = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      copyright.textContent = "\u23F1 You've been here " + mins + "m " + s + "s \u2014 thanks for staying!";
    });
    copyright.addEventListener("mouseleave", () => {
      copyright.textContent = originalText;
    });
  }

  // 8h. Terminal secret — after typing, show a hidden command
  // (triggered from initTerminal when typing completes)

  // ========================================================
  // INIT
  // ========================================================
  function init() {
    // 1. render
    renderHero();
    renderExperience();
    renderSkills();
    renderCertifications();
    renderProjects();
    renderPublications();
    renderEducation();
    renderContact();
    renderFooter();
    renderDebug();

    // 2. interactions
    initTheme();
    initMobileNav();
    initReveal();
    initTerminal();
    initBackToTop();
    initDebugPanel();

    // 3. eggs
    initKonami();
    initLogoClicks();
    initSudoSparkles();
    initConsoleEgg();
    initTabEgg();
    initRightClickEgg();
    initFooterEgg();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
