/* ========== HEADER JS START ========== */
(() => {
  const header = document.querySelector(".portfolio-header");
  const menuToggle = header.querySelector("#menuToggle");
  const mainNav = header.querySelector("#mainNav");
  const navLinks = mainNav.querySelectorAll("a");

  function closeMenu() {
    mainNav.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.innerHTML =
      '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
})();
/* ========== HEADER JS END ========== */

/* ========== TESTIMONIALS JS START ========== */
(function () {
  function initReviewWalls() {
    document.querySelectorAll(".review-wall").forEach(function (section) {
      if (section.dataset.rwReady === "true") return;
      section.dataset.rwReady = "true";

      const track = section.querySelector(".rw-track");
      const viewport = section.querySelector(".rw-viewport");
      const cards = Array.from(section.querySelectorAll(".rw-card"));
      const prev = section.querySelector(".rw-prev");
      const next = section.querySelector(".rw-next");
      const dotsWrap = section.querySelector(".rw-dots");
      const counter = section.querySelector(".rw-count");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      let index = 0;
      let timer = null;

      if (!track || !viewport || !cards.length) return;

      function visibleCards() {
        if (window.innerWidth <= 560) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
      }

      function maxIndex() {
        return Math.max(0, cards.length - visibleCards());
      }

      function buildDots() {
        dotsWrap.innerHTML = "";
        const positions = maxIndex() + 1;

        for (let i = 0; i < positions; i++) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = "rw-dot";
          dot.setAttribute("aria-label", "Show review group " + (i + 1));

          dot.addEventListener("click", function () {
            goTo(i);
            restartAuto();
          });

          dotsWrap.appendChild(dot);
        }
      }

      function update() {
        index = Math.min(index, maxIndex());

        const firstCard = cards[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const step = firstCard.getBoundingClientRect().width + gap;

        track.style.transform = "translateX(-" + (index * step) + "px)";

        cards.forEach(function (card, i) {
          card.setAttribute(
            "aria-hidden",
            i >= index && i < index + visibleCards() ? "false" : "true"
          );
          card.inert = !(i >= index && i < index + visibleCards());
        });

        const dots = Array.from(dotsWrap.querySelectorAll(".rw-dot"));
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === index);

          if (i === index) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });

        if (counter) {
          counter.textContent =
            String(index + 1).padStart(2, "0") +
            " / " +
            String(maxIndex() + 1).padStart(2, "0");
        }
      }

      function goTo(position) {
        const limit = maxIndex();
        index = position > limit ? 0 : position < 0 ? limit : position;
        update();
      }

      function stopAuto() {
        window.clearInterval(timer);
        timer = null;
      }

      function startAuto() {
        stopAuto();
        if (reduceMotion.matches || maxIndex() === 0) return;

        timer = window.setInterval(function () {
          if (!document.hidden) goTo(index + 1);
        }, 4500);
      }

      function restartAuto() {
        startAuto();
      }

      prev.addEventListener("click", function () {
        goTo(index - 1);
        restartAuto();
      });

      next.addEventListener("click", function () {
        goTo(index + 1);
        restartAuto();
      });

      section.addEventListener("mouseenter", stopAuto);
      section.addEventListener("mouseleave", startAuto);
      section.addEventListener("focusin", stopAuto);
      section.addEventListener("focusout", function (event) {
        if (!section.contains(event.relatedTarget)) startAuto();
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stopAuto();
        else startAuto();
      });

      window.addEventListener("resize", function () {
        index = Math.min(index, maxIndex());
        buildDots();
        update();
        startAuto();
      });

      if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", startAuto);
      }

      buildDots();
      update();
      startAuto();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReviewWalls);
  } else {
    initReviewWalls();
  }
})();
/* ========== TESTIMONIALS JS END ========== */

/* ========== CERTIFICATIONS JS START ========== */
(function () {
  const section = document.querySelector(".cert-section");
  if (!section || section.dataset.certReady === "true") return;
  section.dataset.certReady = "true";

  const modal = section.querySelector(".cert-modal");
  const modalImage = section.querySelector(".cert-modal-image");
  const modalTitle = section.querySelector(".cert-modal-title");
  const openLink = section.querySelector(".cert-modal-open");
  const closeButtons = section.querySelectorAll("[data-cert-close]");
  const previewButtons = section.querySelectorAll("[data-cert-image]");
  let lastTrigger = null;

  function openCertificate(button) {
    const imagePath = button.dataset.certImage;
    const title = button.dataset.certTitle || "Certificate";

    lastTrigger = button;
    modalTitle.textContent = title;
    modalImage.src = imagePath;
    modalImage.alt = title + " preview";
    openLink.href = imagePath;
    openLink.setAttribute("aria-disabled", "false");

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".cert-modal-close").focus();
  }

  function closeCertificate() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastTrigger) lastTrigger.focus();
  }

  previewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openCertificate(button);
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeCertificate);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeCertificate();
    }
  });

  modalImage.addEventListener("error", function () {
    openLink.setAttribute("aria-disabled", "true");
  });

  modalImage.addEventListener("load", function () {
    openLink.setAttribute("aria-disabled", "false");
  });
})();
/* ========== CERTIFICATIONS JS END ========== */

/* ========== FAQ JS START ========== */
(function () {
  document.querySelectorAll(".faq-section").forEach(function (section) {
    if (section.dataset.faqReady === "true") return;
    section.dataset.faqReady = "true";

    const items = Array.from(section.querySelectorAll(".faq-item"));

    function setItem(item, open) {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));

      if (open) {
        answer.hidden = false;
      } else {
        answer.hidden = true;
      }
    }

    items.forEach(function (item) {
      const button = item.querySelector(".faq-question");

      button.addEventListener("click", function () {
        const shouldOpen = !item.classList.contains("is-open");

        /* Keep only one answer open at a time */
        items.forEach(function (otherItem) {
          setItem(otherItem, otherItem === item && shouldOpen);
        });
      });
    });
  });
})();
/* ========== FAQ JS END ========== */

/* ========== CONTACT JS START ========== */
(function () {
  const form = document.getElementById("portfolioContactForm");
  if (!form || form.dataset.contactReady === "true") return;
  form.dataset.contactReady = "true";

  /*
   * IMPORTANT:
   * Replace this with your WhatsApp number in international format.
   * Example India: 919876543210
   * Do not include +, spaces, or hyphens.
   */
  const WHATSAPP_NUMBER = "918606783725";

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const error = document.getElementById("contactFormError");
    error.hidden = true;
    error.textContent = "";

    if (!form.reportValidity()) return;

    if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
      error.textContent =
        "Please configure your WhatsApp number in the contact form script.";
      error.hidden = false;
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const service = String(formData.get("service") || "").trim();

    const message = [
      "Hello! I am interested in your digital marketing services.",
      "",
      "CONTACT DETAILS",
      "Name: " + name,
      "Phone: " + phone,
      "Email: " + email,
      "Service required: " + service,
      "",
      "Please contact me to discuss my requirements."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    window.location.href = whatsappURL;
  });
})();
/* ========== CONTACT JS END ========== */

/* ========== FOOTER JS START ========== */
(function () {
  const year = document.getElementById("pf-current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
/* ========== FOOTER JS END ========== */
