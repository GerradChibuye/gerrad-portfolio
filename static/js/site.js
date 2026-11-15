"use strict";

// Mobile navigation
const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// Repeatable scroll reveal animations and heading typing effects

const revealElements = document.querySelectorAll(".reveal");
const typingElements = document.querySelectorAll("[data-typing]");

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

// Keep the complete heading text available for accessibility.
typingElements.forEach((element) => {
    element.dataset.typingText = element.textContent.trim();
});

// Scroll-linked heading typing and active navigation.
if (!prefersReducedMotion) {
    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    const sectionLinks = navigation
        ? Array.from(navigation.querySelectorAll('a[href*="#"]'))
        : [];

    let scrollFramePending = false;

    function updateScrollEffects() {
        scrollFramePending = false;

        // Calculate heading character visibility from scroll position.
        typingElements.forEach((element) => {
            const fullText = element.dataset.typingText;
            const rect = element.getBoundingClientRect();

            const start = window.innerHeight * 0.82;
            const end = window.innerHeight * 0.48;

            const progress = Math.max(
                0,
                Math.min(1, (start - rect.top) / (start - end))
            );

            const visibleCharacters = Math.round(
                progress * fullText.length
            );

            const visibleText = fullText.slice(0, visibleCharacters);

            if (element.textContent !== visibleText) {
                element.textContent = visibleText;
            }

            element.classList.toggle(
                "is-typing",
                visibleCharacters > 0 &&
                visibleCharacters < fullText.length
            );
        });

        // Identify the section currently crossing the activation line.
        if (sections.length && sectionLinks.length) {
            const activationLine = window.innerHeight * 0.36;
            let activeSection = sections[0];

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();

                if (rect.top <= activationLine) {
                    activeSection = section;
                }
            });

            sectionLinks.forEach((link) => {
                const targetId = link.hash.slice(1);

                if (targetId === activeSection.id) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }
    }

    function requestScrollUpdate() {
        if (!scrollFramePending) {
            scrollFramePending = true;
            window.requestAnimationFrame(updateScrollEffects);
        }
    }

    window.addEventListener("scroll", requestScrollUpdate, {
        passive: true
    });

    window.addEventListener("resize", requestScrollUpdate);

    // Also handles pages restored at a previous scroll position.
    requestScrollUpdate();
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    // Replay entrance transitions whenever elements re-enter the viewport.
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    entry.target.classList.remove("visible");
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

}

// Animated glowing cursor
(() => {
    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || reducedMotion) return;

    const dot = document.createElement("div");
    const glow = document.createElement("div");

    dot.className = "gc-cursor-dot";
    glow.className = "gc-cursor-glow";

    document.body.append(glow, dot);

    let mouseX = 0;
    let mouseY = 0;

    function moveCursor(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        dot.style.transform =
            `translate3d(${mouseX - 3.5}px, ${mouseY - 3.5}px, 0)`;

        glow.style.transform =
            `translate3d(${mouseX - 19}px, ${mouseY - 19}px, 0)`;

        dot.classList.add("visible");
        glow.classList.add("visible");
    }

    document.addEventListener("pointermove", moveCursor);

    document.addEventListener("pointerover", (event) => {
        if (event.target.closest("a, button, [role='button'], .project-card, .expertise-card")) {
            dot.classList.add("active");
            glow.classList.add("active");
        } else {
            dot.classList.remove("active");
            glow.classList.remove("active");
        }
    });

    document.addEventListener("pointerdown", () => {
        dot.classList.add("pressed");
    });

    document.addEventListener("pointerup", () => {
        dot.classList.remove("pressed");
    });

    document.addEventListener("pointerleave", () => {
        dot.classList.remove("visible");
        glow.classList.remove("visible");
    });

    document.addEventListener("pointerenter", () => {
        dot.classList.add("visible");
        glow.classList.add("visible");
    });
})();


// Contact form submission feedback
(() => {
    const contactForm = document.querySelector(".contact-form");

    if (!contactForm) return;

    const submitButton = contactForm.querySelector(".contact-submit");
    const buttonText = submitButton?.querySelector(".submit-button-text");

    if (!submitButton || !buttonText) return;

    const originalText = buttonText.textContent;

    contactForm.addEventListener("submit", () => {
        // The browser's native validation runs before this event.
        submitButton.disabled = true;
        submitButton.classList.add("is-loading");
        submitButton.setAttribute("aria-busy", "true");
        buttonText.textContent = "Sending message...";
    });

    // Restore the button if the page is restored from browser history.
    window.addEventListener("pageshow", () => {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
        submitButton.removeAttribute("aria-busy");
        buttonText.textContent = originalText;
    });
})();


// Periodic contact CTA attention while the contact section is visible
(() => {
    const contactForm = document.querySelector(".contact-form");
    const submitButton = contactForm?.querySelector(".contact-submit");

    if (!contactForm || !submitButton) return;

    const contactSection = contactForm.closest(".contact-section")
        || contactForm.closest("section");

    if (!contactSection || !("IntersectionObserver" in window)) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let pulseInterval = null;
    let hasInteracted = false;

    const stopPulse = () => {
        if (pulseInterval) {
            clearInterval(pulseInterval);
            pulseInterval = null;
        }

        submitButton.classList.remove("cta-attention");
    };

    const startPulse = () => {
        if (pulseInterval || hasInteracted) return;

        // First attention pulse after entering the contact section.
        submitButton.classList.add("cta-attention");

        pulseInterval = setInterval(() => {
            submitButton.classList.remove("cta-attention");

            // Restart the CSS animation cleanly.
            void submitButton.offsetWidth;

            submitButton.classList.add("cta-attention");
        }, 5000);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startPulse();
            } else {
                stopPulse();
            }
        });
    }, {
        threshold: 0.35
    });

    observer.observe(contactSection);

    // Stop attention animation once the visitor engages with the form.
    contactForm.addEventListener("focusin", () => {
        hasInteracted = true;
        stopPulse();
    });

    contactForm.addEventListener("submit", stopPulse);
})();

// GTA community member counter
document.addEventListener("DOMContentLoaded", () => {
    const counter = document.querySelector(".gta-member-number");

    if (!counter || counter.dataset.animated === "true") return;

    const target = Number(counter.dataset.count);

    if (!Number.isFinite(target) || target <= 0) return;

    const duration = 1800;
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting || started) return;

        started = true;
        counter.dataset.animated = "true";

        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress = 1 - Math.pow(1 - progress, 4);

            counter.textContent = Math.floor(
                easedProgress * target
            ).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
                observer.disconnect();
            }
        }

        requestAnimationFrame(updateCounter);
    }, { threshold: 0.5 });

    observer.observe(counter);
});


// Project thumbnail viewport playback
document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".project-preview-video");

    if (!("IntersectionObserver" in window)) {
        videos.forEach(video => video.play().catch(() => {}));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target;
            video.dataset.inViewport = entry.isIntersecting ? "true" : "false";

            if (entry.isIntersecting && document.visibilityState === "visible") {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, {
        threshold: 0.25
    });

    videos.forEach(video => observer.observe(video));

    document.addEventListener("visibilitychange", () => {
        videos.forEach(video => {
            if (
                document.visibilityState === "visible" &&
                video.dataset.inViewport === "true"
            ) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    });
});
