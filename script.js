(function () {
  const phone = "5216271084483";
  const loader = document.getElementById("loader");
  const nav = document.getElementById("nav");
  const ham = document.getElementById("ham");
  const mob = document.getElementById("mob");
  const form = document.getElementById("cForm");
  const twText = document.getElementById("twText");
  const hero = document.getElementById("hero");

  document.body.classList.add("loading");

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("hide");
      document.body.classList.remove("loading");
    }, 1550);
  });

  const setNavState = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 24);
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  ham?.addEventListener("click", () => {
    const isOpen = mob?.classList.toggle("open");
    ham.classList.toggle("active", Boolean(isOpen));
    ham.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mob?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mob.classList.remove("open");
      ham?.classList.remove("active");
      ham?.setAttribute("aria-expanded", "false");
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".rev").forEach((el) => revealObserver.observe(el));

  if (hero) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle("hero-visible", entry.isIntersecting);
      });
    }, { threshold: 0.18 });

    heroObserver.observe(hero);
  }

  const animateNumber = (el) => {
    const target = Number(el.dataset.count || el.dataset.heroCount);
    if (!Number.isFinite(target)) return;

    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        numberObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.44 });

  document
    .querySelectorAll("[data-count], [data-hero-count]")
    .forEach((el) => numberObserver.observe(el));

  const typeWords = [
    "tablas aserradas",
    "polines de madera",
    "tablones de pino",
    "triplay y paneles",
    "despacho con transporte propio"
  ];

  let wordIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    if (!twText) return;

    const current = typeWords[wordIndex];
    twText.textContent = current.slice(0, Math.max(letterIndex, 1));

    if (!deleting && letterIndex < current.length) {
      letterIndex += 1;
      window.setTimeout(typeLoop, 58);
      return;
    }

    if (!deleting && letterIndex === current.length) {
      deleting = true;
      window.setTimeout(typeLoop, 1200);
      return;
    }

    if (deleting && letterIndex > 1) {
      letterIndex -= 1;
      window.setTimeout(typeLoop, 28);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % typeWords.length;
    letterIndex = 1;
    window.setTimeout(typeLoop, 240);
  };

  typeLoop();

  const buildWhatsAppMessage = () => {
    const name = document.getElementById("fn")?.value.trim() || "";
    const tel = document.getElementById("ft")?.value.trim() || "";
    const product = document.getElementById("fs")?.value || "";
    const details = document.getElementById("fm")?.value.trim() || "";

    return [
      "Hola, quiero solicitar una cotización con Maxiem Maderas SA de CV.",
      `Nombre: ${name}`,
      `Teléfono: ${tel}`,
      `Producto: ${product}`,
      `Detalle: ${details || "Pendiente de compartir"}`
    ].join("\n");
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
      const isEmpty = !field.value.trim();
      field.classList.toggle("invalid", isEmpty);
      if (isEmpty) valid = false;
    });

    if (!valid) {
      const firstInvalid = form.querySelector(".invalid");
      firstInvalid?.focus();
      return;
    }

    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  });

  form?.querySelectorAll(".fi").forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("invalid"));
    field.addEventListener("change", () => field.classList.remove("invalid"));
  });

  function createParticles(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const count = options.count || 70;
    const colors = options.colors || ["#7FB7DE", "#C9975A", "#FFFFFF"];

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resetParticle = (particle, initial = false) => {
      particle.x = Math.random() * width;
      particle.y = initial ? Math.random() * height : height + 20;
      particle.vx = (Math.random() - .5) * .28;
      particle.vy = -(.14 + Math.random() * .42);
      particle.r = .8 + Math.random() * 2.4;
      particle.alpha = .16 + Math.random() * .42;
      particle.color = colors[Math.floor(Math.random() * colors.length)];
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        const particle = {};
        resetParticle(particle, true);
        particles.push(particle);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.y < -30 || particle.x < -30 || particle.x > width + 30) {
          resetParticle(particle);
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(particle.color, particle.alpha);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(127, 183, 222, ${0.12 * (1 - distance / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      cancelAnimationFrame(animationFrame);
      resize();
      init();
      draw();
    };

    resize();
    init();
    draw();
    window.addEventListener("resize", handleResize);
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  createParticles("pcanvas", { count: 86 });
  createParticles("pcanvasWhy", { count: 54, colors: ["#7FB7DE", "#C9975A"] });
  createParticles("pcanvasGaleria", { count: 62, colors: ["#7FB7DE", "#C9975A", "#E7E2D8"] });
})();
