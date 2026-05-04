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
 *  8. 8 easter eggs
 *  9. Dynamic features: scroll progress, time greeting, animated counters
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
    // Dynamic greeting based on time of day
    const hour = new Date().getHours();
    let greeting = h.greeting;
    if (hour < 12) greeting = "Good morning, I'm";
    else if (hour < 18) greeting = "Good afternoon, I'm";
    else greeting = "Good evening, I'm";
    $(".hero__greeting").textContent = greeting;
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
      if (job.logoUrl) {
        const img = el("img", "experience__logo-img");
        img.src = job.logoUrl;
        img.alt = job.company + " logo";
        img.loading = "lazy";
        logo.appendChild(img);
      } else {
        logo.textContent = job.logo || job.company.slice(0, 2).toUpperCase();
      }
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
    const highlights = ["AWS", "EC2", "ElastiCache", "Linux", "Kubernetes", "Terraform", "Python"];
    Object.entries(CONTENT.skills).forEach(([group, items]) => {
      const groupEl = el("div", "skills__group");
      groupEl.setAttribute("data-reveal", "");

      const title = group.replace(/_/g, " ");
      groupEl.appendChild(el("h3", "skills__group__title", title));

      const items_wrap = el("div", "skills__items");
      items.forEach((s) => {
        const isHighlight = highlights.includes(s.name);
        const chip = el("span", isHighlight ? "skill skill--highlight" : "skill");
        chip.textContent = `${s.icon} ${s.name}`;
        if (s.desc) {
          chip.setAttribute("data-skill", s.name);
          chip.setAttribute("data-desc", s.desc);
          chip.style.cursor = "pointer";
        }
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
      card.setAttribute("data-tilt", "");
      card.setAttribute("data-glow", "");
      if (c.link) {
        card.href = c.link;
        card.target = "_blank";
        card.rel = "noopener";
      }
      const inner = el("div", "tilt-inner");
      inner.appendChild(el("div", "cert__badge", c.badge || "🏅"));
      inner.appendChild(el("h3", "cert__title", c.title));
      const meta = [c.issuer, c.date, c.expires && `Expires ${c.expires}`]
        .filter(Boolean)
        .join(" · ");
      inner.appendChild(el("p", "cert__meta", meta));
      const glow = el("div", "card-glow");
      card.appendChild(inner);
      card.appendChild(glow);
      grid.appendChild(card);
    });
  }

  function renderProjects() {
    const grid = $("#projects-grid");
    CONTENT.projects.forEach((p) => {
      const card = el("article", "project");
      card.setAttribute("data-reveal", "");
      card.setAttribute("data-tilt", "");
      card.setAttribute("data-glow", "");

      const inner = el("div", "tilt-inner");
      inner.appendChild(el("span", "project__id", p.id));
      inner.appendChild(el("div", "project__icon", p.icon));
      inner.appendChild(el("h3", "project__title", p.title));
      inner.appendChild(el("p", "project__description", p.description));

      const tech = el("div", "project__tech");
      p.tech.forEach((t) =>
        tech.appendChild(el("span", "project__tech-tag", t))
      );
      inner.appendChild(tech);

      if (p.link) {
        const a = el("a", "project__link", "View on GitHub →");
        a.href = p.link;
        a.target = "_blank";
        a.rel = "noopener";
        inner.appendChild(a);
      }

      const glow = el("div", "card-glow");
      card.appendChild(inner);
      card.appendChild(glow);
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
  // 9. INTERACTIVE CANVAS (particles + neural network)
  // ========================================================
  function initCanvas() {
    const canvas = $("#particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const mouse = { x: null, y: null };
    let particles = [];
    let neuralNodes = [];
    const NEURAL_SPACING = 50;
    const NEURAL_RADIUS = 200;
    const NEURAL_CONNECT = 90;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", () => { resize(); initGrid(); });

    document.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    function mkParticle() {
      return {
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        sx: (Math.random() - 0.5) * 0.4, sy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.5 ? "126,231,135" : "88,166,255"
      };
    }
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) particles.push(mkParticle());

    function initGrid() {
      neuralNodes = [];
      const pageH = Math.max(document.body.scrollHeight, 4000);
      const cols = Math.ceil(canvas.width / NEURAL_SPACING) + 1;
      const rows = Math.ceil(pageH / NEURAL_SPACING) + 1;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          neuralNodes.push({
            x: c * NEURAL_SPACING + (Math.random() - 0.5) * 18,
            y: r * NEURAL_SPACING + (Math.random() - 0.5) * 18
          });
    }

    function drawParticles() {
      for (const p of particles) {
        p.x += p.sx; p.y += p.sy;
        if (mouse.x !== null) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const f = (120 - dist) / 120;
            p.x += (dx / dist) * f * 1.5;
            p.y += (dy / dist) * f * 1.5;
          }
        }
        if (p.x < 0 || p.x > canvas.width) p.sx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.sy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(126,231,135,${(1 - dist / 150) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function drawNeural() {
      if (mouse.x === null || !neuralNodes.length) return;
      const scrollY = window.scrollY;
      const active = [];
      for (const node of neuralNodes) {
        const sy = node.y - scrollY;
        if (sy < -NEURAL_RADIUS || sy > canvas.height + NEURAL_RADIUS) continue;
        const dx = node.x - mouse.x, dy = sy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < NEURAL_RADIUS) {
          const intensity = 1 - dist / NEURAL_RADIUS;
          active.push({ x: node.x, y: sy, dist, intensity });
          ctx.beginPath();
          ctx.arc(node.x, sy, 1.5 + intensity * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(88,166,255,${intensity * 0.7})`;
          ctx.fill();
        }
      }
      for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
          const dx = active[i].x - active[j].x, dy = active[i].y - active[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < NEURAL_CONNECT) {
            const alpha = Math.min(active[i].intensity, active[j].intensity) * (1 - dist / NEURAL_CONNECT) * 0.5;
            ctx.beginPath();
            ctx.moveTo(active[i].x, active[i].y);
            ctx.lineTo(active[j].x, active[j].y);
            ctx.strokeStyle = `rgba(88,166,255,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        if (active[i].dist < NEURAL_RADIUS * 0.5) {
          ctx.beginPath();
          ctx.moveTo(active[i].x, active[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(126,231,135,${active[i].intensity * 0.15})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, NEURAL_RADIUS * 0.6);
      grad.addColorStop(0, "rgba(88,166,255,0.04)");
      grad.addColorStop(1, "rgba(88,166,255,0)");
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, NEURAL_RADIUS * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawParticles();
      drawNeural();
      requestAnimationFrame(animate);
    }
    initGrid();
    window.addEventListener("load", initGrid);
    animate();
  }

  // ========================================================
  // 10. 3D TILT CARDS
  // ========================================================
  function initTilt() {
    $$("[data-tilt]").forEach((card) => {
      const inner = $(".tilt-inner", card);
      if (!inner) return;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const rx = ((y - rect.height / 2) / (rect.height / 2)) * -8;
        const ry = ((x - rect.width / 2) / (rect.width / 2)) * 8;
        inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        inner.style.transform = "rotateX(0) rotateY(0) scale(1)";
      });
    });
  }

  // ========================================================
  // 11. SKILL MODAL
  // ========================================================
  function initSkillModal() {
    const overlay = $("#skillModal");
    const titleEl = $("#skillModalTitle");
    const descEl = $("#skillModalDesc");
    if (!overlay) return;
    $$("[data-skill]").forEach((badge) => {
      badge.addEventListener("click", () => {
        titleEl.textContent = badge.getAttribute("data-skill");
        descEl.textContent = badge.getAttribute("data-desc");
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
      });
    });
    const close = () => { overlay.classList.remove("is-open"); overlay.setAttribute("aria-hidden", "true"); };
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    $(".skill-modal__close", overlay).addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  // ========================================================
  // 12. CARD GLOW FOLLOW
  // ========================================================
  function initCardGlow() {
    $$("[data-glow]").forEach((card) => {
      const glow = $(".card-glow", card);
      if (!glow) return;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        glow.style.setProperty("--glow-x", ((e.clientX - rect.left) / rect.width * 100) + "%");
        glow.style.setProperty("--glow-y", ((e.clientY - rect.top) / rect.height * 100) + "%");
      });
    });
  }

  // ========================================================
  // 13. PARALLAX ORBS
  // ========================================================
  function initParallaxOrbs() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          $$(".orb").forEach((orb, i) => {
            orb.style.transform = `translateY(${y * (0.02 + i * 0.01)}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================================
  // 14. ACTIVE NAV ON SCROLL
  // ========================================================
  function initActiveNav() {
    const sections = $$(".section, .hero");
    const anchors = $$(".nav__links a");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          anchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.3, rootMargin: "-70px 0px 0px 0px" });
    sections.forEach((s) => io.observe(s));
  }

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
    initCanvas();
    initTilt();
    initSkillModal();
    initCardGlow();
    initParallaxOrbs();
    initActiveNav();

    // 3. eggs
    initKonami();
    initLogoClicks();
    initSudoSparkles();
    initConsoleEgg();
    initTabEgg();
    initRightClickEgg();
    initFooterEgg();

    // 4. dynamic features
    initScrollProgress();
    initAnimatedCounters();
    initMouseGlow();
    initStaggeredReveal();
    initTextScramble();
    initMagneticButtons();
    initParallaxCards();
    initTypingSubtitle();
    initCursorTrail();
  }

  // ========================================================
  // 10. DYNAMIC FEATURES
  // ========================================================

  // Scroll progress bar at top of page
  function initScrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = progress + "%";
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Animated counters for stats (years, projects, etc.)
  function initAnimatedCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }

  // Subtle mouse glow that follows cursor on hero section
  function initMouseGlow() {
    if (prefersReducedMotion) return;
    const hero = $(".hero");
    if (!hero) return;
    const glow = document.createElement("div");
    glow.className = "hero-mouse-glow";
    hero.appendChild(glow);
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + "px";
      glow.style.top = (e.clientY - rect.top) + "px";
      glow.style.opacity = "1";
    });
    hero.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  }

  // Staggered reveal for grid items
  function initStaggeredReveal() {
    const grids = $$(".skills__items, .cert__grid, .projects__grid, .contact__grid");
    grids.forEach((grid) => {
      const items = [...grid.children];
      items.forEach((item, i) => {
        item.style.transitionDelay = (i * 0.05) + "s";
      });
    });
  }

  // Text scramble effect on section titles when they come into view
  function initTextScramble() {
    if (prefersReducedMotion) return;
    const chars = "!<>-_\\/[]{}—=+*^?#_";
    function scramble(el) {
      const original = el.textContent;
      const length = original.length;
      let iteration = 0;
      const interval = setInterval(() => {
        el.textContent = original.split("").map((char, i) => {
          if (i < iteration) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        iteration += 1 / 2;
        if (iteration >= length) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 25);
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scramble(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    $$(".section__title").forEach((t) => io.observe(t));
  }

  // Magnetic effect on buttons — they pull toward cursor
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    $$(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
        btn.style.transition = "transform 0.3s ease";
        setTimeout(() => { btn.style.transition = ""; }, 300);
      });
    });
  }

  // Parallax depth on cards based on scroll position
  function initParallaxCards() {
    if (prefersReducedMotion) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        $$(".experience__item, .project, .cert").forEach((card) => {
          const rect = card.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const viewCenter = window.innerHeight / 2;
          const offset = (center - viewCenter) * 0.02;
          card.style.transform = `translateY(${-offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    });
  }

  // Typing effect for subtitle — cycles through roles
  function initTypingSubtitle() {
    if (prefersReducedMotion) return;
    const subtitleEl = $(".hero__subtitle");
    if (!subtitleEl) return;
    const phrases = [
      CONTENT.hero.subtitle,
      "EC2 Linux SME · ElastiCache SME · Dublin 🇮🇪",
      "Debugging what others can't since 2019",
      "Reliability engineer by day, code tinkerer by night"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function type() {
      const current = phrases[phraseIdx];
      if (!deleting) {
        subtitleEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx >= current.length) {
          pauseTimer = setTimeout(() => { deleting = true; type(); }, 3000);
          return;
        }
        setTimeout(type, 50 + Math.random() * 30);
      } else {
        subtitleEl.textContent = current.slice(0, charIdx);
        charIdx--;
        if (charIdx <= 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 25);
      }
    }
    // Start cycling after initial display
    setTimeout(() => { deleting = true; type(); }, 4000);
  }

  // Cursor trail particles
  function initCursorTrail() {
    if (prefersReducedMotion) return;
    let throttle = 0;
    document.addEventListener("mousemove", (e) => {
      throttle++;
      if (throttle % 3 !== 0) return;
      const dot = document.createElement("div");
      dot.className = "cursor-dot";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
