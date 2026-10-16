
/* ==================================================
   AETERIUM SMP
   Shared JavaScript for all pages
================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initFooterYear();
  initCopyButtons();
  initRevealAnimations();
  initTutorialFilters();
});

/* =============== FOOTER YEAR =============== */

function initFooterYear() {
  const currentYear = new Date().getFullYear();

  document.querySelectorAll("[data-year], #year").forEach((element) => {
    element.textContent = currentYear;
  });
}

/* =============== COPY BUTTONS =============== */

function initCopyButtons() {
  const copyButtons = document.querySelectorAll("[data-copy]");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;

      if (!value) {
        showCopyFeedback(button, false);
        return;
      }

      const copied = await copyText(value);
      showCopyFeedback(button, copied);
    });
  });
}

async function copyText(value) {
  // Clipboard API umumnya tersedia pada HTTPS atau localhost.
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      // Coba metode cadangan jika akses clipboard ditolak.
    }
  }

  // Metode cadangan untuk browser lama atau halaman lokal.
  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.setAttribute("aria-hidden", "true");

  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let success = false;

  try {
    success = document.execCommand("copy");
  } catch (error) {
    success = false;
  }

  textarea.remove();

  return success;
}

function showCopyFeedback(button, success) {
  if (button.dataset.copyFeedback === "busy") {
    return;
  }

  const originalText =
    button.dataset.originalText || button.textContent.trim();

  button.dataset.originalText = originalText;
  button.dataset.copyFeedback = "busy";

  if (success) {
    button.textContent = "Tersalin ✓";
    button.classList.add("copied");
    button.setAttribute("aria-label", "Berhasil disalin");
  } else {
    button.textContent = "Gagal menyalin";
    button.classList.remove("copied");
    button.setAttribute("aria-label", "Gagal menyalin teks");
  }

  button.disabled = true;

  window.setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("copied");
    button.disabled = false;

    button.removeAttribute("aria-label");
    delete button.dataset.copyFeedback;
  }, 1600);
}

/* =============== SCROLL REVEAL =============== */

function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".aet-reveal");

  if (revealElements.length === 0) {
    return;
  }

  // Tampilkan langsung jika browser tidak mendukung API animasi.
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px 35px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

function initTutorialFilters() {
    const filters = document.querySelectorAll(
        "[data-tutorial-filter]"
    );

    const cards = document.querySelectorAll(
        "[data-tutorial-category]"
    );

    const emptyMessage = document.querySelector("#tutorial-empty");

    if (!filters.length || !cards.length) return;

    filters.forEach((button) => {
        button.addEventListener("click", () => {
            const selected = button.dataset.tutorialFilter;

            filters.forEach((filter) => {
                const active =
                    filter === button;

                filter.setAttribute(
                    "aria-pressed",
                    String(active)
                );

                filter.classList.toggle(
                    "aet-btn-primary",
                    active
                );

                filter.classList.toggle(
                    "aet-btn-secondary",
                    !active
                );
            });

            let visibleCount = 0;

            cards.forEach((card) => {
                const visible =
                    selected === "all" ||
                    card.dataset.tutorialCategory === selected;

                card.hidden = !visible;

                if (visible) visibleCount++;
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount !== 0;
            }
        });
    });
}

function initTutorialFilters() {
    const buttons = document.querySelectorAll(
        "[data-tutorial-filter]"
    );

    const cards = document.querySelectorAll(
        "[data-tutorial-category]"
    );

    const emptyMessage = document.querySelector("#tutorial-empty");

    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.dataset.tutorialFilter;

            buttons.forEach((item) => {
                const active = item === button;

                item.setAttribute(
                    "aria-pressed",
                    String(active)
                );

                item.classList.toggle(
                    "aet-btn-primary",
                    active
                );

                item.classList.toggle(
                    "aet-btn-secondary",
                    !active
                );
            });

            let visibleCount = 0;

            cards.forEach((card) => {
                const visible =
                    category === "all" ||
                    card.dataset.tutorialCategory === category;

                card.hidden = !visible;

                if (visible) visibleCount++;
            });

            if (emptyMessage) {
                emptyMessage.hidden = visibleCount > 0;
            }
        });
    });
}
