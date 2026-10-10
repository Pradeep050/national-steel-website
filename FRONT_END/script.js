
/* =====================================================
   NATIONAL STEEL AGENCIES
   Main JavaScript
   HTML changes are not required by this script.
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       1. MOBILE NAVIGATION
    ===================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    function closeMobileMenu() {
        if (!menuBtn || !navMenu) return;

        navMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    if (menuBtn && navMenu) {
        menuBtn.setAttribute("aria-controls", "navMenu");
        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            const isOpen = navMenu.classList.toggle("open");

            menuBtn.setAttribute("aria-expanded", String(isOpen));

            const icon = menuBtn.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }
        });

        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", function (event) {
            if (
                navMenu.classList.contains("open") &&
                !navMenu.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================================
       2. NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {
        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();


    /* =====================================================
       3. ACTIVE NAVIGATION LINK
    ===================================================== */

    const navLinks = document.querySelectorAll("#navMenu a");

    // Use the first element for each section ID.
    // This avoids processing the same section more than once
    // when the existing HTML contains duplicate IDs.
    const seenSectionIds = new Set();

    const pageSections = Array.from(
        document.querySelectorAll("section[id]")
    ).filter(function (section) {
        if (!section.id || section.id === "home") {
            return false;
        }

        if (seenSectionIds.has(section.id)) {
            return false;
        }

        seenSectionIds.add(section.id);
        return true;
    });

    function updateActiveNavigation() {
        let currentSection = "home";

        const offset =
            window.scrollY +
            (navbar ? navbar.offsetHeight : 82) +
            60;

        pageSections.forEach(function (section) {
            const sectionTop =
                section.getBoundingClientRect().top +
                window.scrollY;

            if (offset >= sectionTop) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            const isActive = href === "#" + currentSection;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    window.addEventListener("resize", updateActiveNavigation);

    updateActiveNavigation();


    /* =====================================================
       4. HERO SLIDER
       - Automatic slide every 5 seconds
       - Manual dot navigation
       - Swipe support for mobile
       - Pause on hover
       - Pause when browser tab is hidden
       - No arrow buttons required
    ===================================================== */

    const hero = document.querySelector(".hero");

    if (hero) {
        const slides = Array.from(
            hero.querySelectorAll(".hero-slide")
        );

        // Support dots placed inside the hero or immediately
        // outside it, in case the existing HTML uses either layout.
        let dots = Array.from(
            hero.querySelectorAll(".hero-dots .dot")
        );

        if (dots.length === 0) {
            const externalDots = document.querySelector(".hero-dots");

            if (externalDots) {
                dots = Array.from(
                    externalDots.querySelectorAll(".dot")
                );
            }
        }

        const SLIDE_INTERVAL = 5000;
        const SWIPE_THRESHOLD = 50;

        let currentSlide = 0;
        let heroTimer = null;
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;
        let isHovering = false;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        // If no slides exist, skip slider initialization safely.
        if (slides.length > 0) {

            /* ---------- Prepare slides and dots ---------- */

            slides.forEach(function (slide, index) {
                slide.setAttribute(
                    "aria-label",
                    "Slide " + (index + 1) + " of " + slides.length
                );

                slide.setAttribute("aria-hidden", "true");
            });

            dots.forEach(function (dot, index) {
                dot.type = "button";

                dot.setAttribute(
                    "aria-label",
                    "Show slide " + (index + 1)
                );

                dot.setAttribute("aria-pressed", "false");
            });


            /* ---------- Display a slide ---------- */

            function showSlide(index) {
                currentSlide =
                    ((index % slides.length) + slides.length) %
                    slides.length;

                slides.forEach(function (slide, slideIndex) {
                    const isActive = slideIndex === currentSlide;

                    slide.classList.toggle("active", isActive);

                    slide.setAttribute(
                        "aria-hidden",
                        String(!isActive)
                    );
                });

                dots.forEach(function (dot, dotIndex) {
                    const isActive = dotIndex === currentSlide;

                    dot.classList.toggle("active", isActive);

                    dot.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });
            }

            function nextSlide() {
                showSlide(currentSlide + 1);
            }

            function previousSlide() {
                showSlide(currentSlide - 1);
            }


            /* ---------- Automatic sliding ---------- */

            function stopAutoSlide() {
                if (heroTimer !== null) {
                    clearInterval(heroTimer);
                    heroTimer = null;
                }
            }

            function startAutoSlide() {
                stopAutoSlide();

                if (
                    slides.length <= 1 ||
                    reducedMotion.matches ||
                    document.hidden
                ) {
                    return;
                }

                heroTimer = setInterval(function () {
                    if (isHovering || isTouching) {
                        return;
                    }

                    nextSlide();
                }, SLIDE_INTERVAL);
            }

            function restartAutoSlide() {
                startAutoSlide();
            }


            /* ---------- Manual dot navigation ---------- */

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                    restartAutoSlide();
                });
            });


            /* ---------- Pause when hovering ---------- */

            hero.addEventListener("mouseenter", function () {
                isHovering = true;
            });

            hero.addEventListener("mouseleave", function () {
                isHovering = false;
            });


            /* ---------- Touch/swipe support ---------- */

            hero.addEventListener("touchstart", function (event) {
                if (event.touches.length !== 1) return;

                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                isTouching = true;
            }, { passive: true });

            hero.addEventListener("touchend", function (event) {
                if (!isTouching || !event.changedTouches.length) {
                    isTouching = false;
                    return;
                }

                const touch = event.changedTouches[0];

                const distanceX = touchStartX - touch.clientX;
                const distanceY = touchStartY - touch.clientY;

                isTouching = false;

                // Ignore short gestures and vertical page scrolling.
                if (
                    Math.abs(distanceX) < SWIPE_THRESHOLD ||
                    Math.abs(distanceX) <= Math.abs(distanceY)
                ) {
                    return;
                }

                if (distanceX > 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }

                restartAutoSlide();
            }, { passive: true });

            hero.addEventListener("touchcancel", function () {
                isTouching = false;
            }, { passive: true });


            /* ---------- Browser tab visibility ---------- */

            document.addEventListener("visibilitychange", function () {
                if (document.hidden) {
                    stopAutoSlide();
                } else {
                    startAutoSlide();
                }
            });


            /* ---------- Reduced-motion preference ---------- */

            if (typeof reducedMotion.addEventListener === "function") {
                reducedMotion.addEventListener("change", function () {
                    if (reducedMotion.matches) {
                        stopAutoSlide();
                    } else {
                        startAutoSlide();
                    }
                });
            } else if (typeof reducedMotion.addListener === "function") {
                // Compatibility with older browsers.
                reducedMotion.addListener(function () {
                    if (reducedMotion.matches) {
                        stopAutoSlide();
                    } else {
                        startAutoSlide();
                    }
                });
            }


            /* ---------- Initialize the slider ---------- */

            // Respect an existing active slide if one is present.
            const existingActiveIndex = slides.findIndex(function (slide) {
                return slide.classList.contains("active");
            });

            showSlide(existingActiveIndex >= 0 ? existingActiveIndex : 0);

            startAutoSlide();
        }
    }


    /* =====================================================
       5. BACK TO TOP BUTTON
    ===================================================== */

    const backTop = document.getElementById("backTop");

    if (backTop) {
        function updateBackTop() {
            backTop.classList.toggle(
                "show",
                window.scrollY > 500
            );
        }

        window.addEventListener("scroll", updateBackTop, {
            passive: true
        });

        backTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        updateBackTop();
    }


    /* =====================================================
       6. CONTACT FORM VALIDATION
       This validates the form but does not send an enquiry.
       A backend or form service is required for submission.
    ===================================================== */

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (formMessage) {
                formMessage.textContent =
                    "Your enquiry details are valid, but the form " +
                    "has not been sent yet. Please connect a backend " +
                    "or form service to submit your enquiry.";

                formMessage.setAttribute("role", "status");
                formMessage.setAttribute("aria-live", "polite");
            }
        });
    }


    /* =====================================================
       7. PRODUCT CARD NAVIGATION
       Clicking a product card outside a link or button opens
       the destination of that card's product-image link.
    ===================================================== */

    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(function (card) {
        const productLink = card.querySelector(".product-image-link");

        if (!productLink || !productLink.href) {
            return;
        }

        card.addEventListener("click", function (event) {
            // Keep existing anchors, buttons and interactive
            // elements working normally.
            if (
                event.target instanceof Element &&
                event.target.closest("a, button, input, select, textarea")
            ) {
                return;
            }

            window.location.href = productLink.href;
        });
    });


    /* =====================================================
       8. OPTIONAL KEYBOARD NAVIGATION FOR THE HERO
       Left/right arrow keys work when the hero is focused.
       No HTML arrow buttons are created.
    ===================================================== */

    const keyboardHero = document.querySelector(".hero");

    if (keyboardHero) {
        const keyboardSlides = keyboardHero.querySelectorAll(".hero-slide");

        if (keyboardSlides.length > 1) {
            keyboardHero.addEventListener("keydown", function (event) {
                // Do not hijack keys while typing in a form.
                if (
                    event.target instanceof Element &&
                    event.target.closest("input, textarea, select, button, a")
                ) {
                    return;
                }

                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    // The manual dot controls remain the primary
                    // navigation method.
                    const activeIndex = Array.from(keyboardSlides).findIndex(
                        function (slide) {
                            return slide.classList.contains("active");
                        }
                    );

                    const nextIndex =
                        ((activeIndex + 1) % keyboardSlides.length);

                    const dots = Array.from(
                        keyboardHero.querySelectorAll(".hero-dots .dot")
                    );

                    if (dots[nextIndex]) {
                        dots[nextIndex].click();
                    }
                }

                if (event.key === "ArrowLeft") {
                    event.preventDefault();

                    const activeIndex = Array.from(keyboardSlides).findIndex(
                        function (slide) {
                            return slide.classList.contains("active");
                        }
                    );

                    const previousIndex =
                        (activeIndex - 1 + keyboardSlides.length) %
                        keyboardSlides.length;

                    const dots = Array.from(
                        keyboardHero.querySelectorAll(".hero-dots .dot")
                    );

                    if (dots[previousIndex]) {
                        dots[previousIndex].click();
                    }
                }
            });
        }
    }

});
