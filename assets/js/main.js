(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const roles = [
    "FULL-STACK WEB DEVELOPMENT",
    "REACT & NEXT.JS SYSTEMS",
    "NODE.JS BACKENDS & APIS",
    "SCALABLE WEB APPLICATIONS",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const el = document.getElementById("typed-role");
  const typingSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 2000;

  function tick() {
    if (!el) return;
    const current = roles[roleIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, pauseEnd);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typingSpeed);
  }

  if (el) setTimeout(tick, 600);

  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("is-open");
      const expanded = navLinks.classList.contains("is-open");
      menuBtn.setAttribute("aria-expanded", expanded);
    });
  }

  /* Contact form POSTs to FormSubmit (see HTML action). Do not preventDefault. */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
          navLinks?.classList.remove("is-open");
        }
      }
    });
  });

  const header = document.getElementById("site-header");
  function updateHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 32);
  }
  updateHeaderScrolled();
  window.addEventListener("scroll", updateHeaderScrolled, { passive: true });

  const contactSection = document.getElementById("contact");
  const btnTalk = document.querySelector(".header-inner .btn-talk");
  if (contactSection && btnTalk) {
    const hideTalkNearContact = new IntersectionObserver(
      ([entry]) => {
        btnTalk.classList.toggle("btn-talk--hidden", entry.isIntersecting);
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );
    hideTalkNearContact.observe(contactSection);
  }

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else if (revealEls.length) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const heroParallax = document.querySelector(".js-hero-parallax");
  if (heroParallax && !prefersReducedMotion) {
    const strength = parseFloat(heroParallax.getAttribute("data-parallax-strength") || "0.11", 10);
    const heroSection = document.querySelector(".hero");
    let ticking = false;

    function applyParallax() {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        heroParallax.style.transform = "";
        return;
      }
      const y = Math.min(window.scrollY * strength, 88);
      heroParallax.style.transform = y > 0 ? `translate3d(0, ${y}px, 0)` : "";
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            applyParallax();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
    applyParallax();
  }

  const lightbox = document.getElementById("project-lightbox");
  if (lightbox) {
    const imgEl = lightbox.querySelector(".project-lightbox__img");
    const captionEl = lightbox.querySelector(".project-lightbox__caption");
    const btnClose = lightbox.querySelector(".project-lightbox__close");
    const btnPrev = lightbox.querySelector(".project-lightbox__prev");
    const btnNext = lightbox.querySelector(".project-lightbox__next");

    let items = [];
    let index = 0;

    function getGroupItems(group) {
      return Array.from(document.querySelectorAll(`[data-lightbox-group="${group}"]`));
    }

    function showAt(i) {
      if (!items.length || !imgEl) return;
      index = ((i % items.length) + items.length) % items.length;
      const trigger = items[index];
      const img = trigger.querySelector("img");
      if (!img) return;
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || "";
      if (captionEl) {
        captionEl.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : "";
      }
      const multi = items.length > 1;
      if (btnPrev) btnPrev.hidden = !multi;
      if (btnNext) btnNext.hidden = !multi;
    }

    function openLightbox(group, startIndex) {
      items = getGroupItems(group);
      if (!items.length) return;
      showAt(startIndex);
      document.body.classList.add("lightbox-open");
      lightbox.showModal();
      btnClose?.focus();
    }

    function closeLightbox() {
      lightbox.close();
    }

    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
      if (imgEl) {
        imgEl.removeAttribute("src");
        imgEl.alt = "";
      }
      if (captionEl) captionEl.textContent = "";
    });

    document.body.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-lightbox-group]");
      if (!trigger || lightbox.contains(trigger)) return;
      const group = trigger.getAttribute("data-lightbox-group");
      if (!group) return;
      const list = getGroupItems(group);
      const idx = list.indexOf(trigger);
      openLightbox(group, idx >= 0 ? idx : 0);
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    btnClose?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    btnPrev?.addEventListener("click", (e) => {
      e.stopPropagation();
      showAt(index - 1);
    });

    btnNext?.addEventListener("click", (e) => {
      e.stopPropagation();
      showAt(index + 1);
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.open) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showAt(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showAt(index + 1);
      }
    });
  }
})();
