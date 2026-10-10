
/* =====================================================
   NATIONAL STEEL AGENCIES
   Main JavaScript
===================================================== */


/* =====================================================
   1. MOBILE NAVIGATION
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");
        const icon = menuBtn.querySelector("i");

        menuBtn.setAttribute("aria-expanded", String(isOpen));

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    });
}


/* Close mobile navigation after selecting a link */

if (navMenu) {
    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("open");

            if (menuBtn) {
                menuBtn.setAttribute("aria-expanded", "false");

                const icon = menuBtn.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    });
}


/* =====================================================
   2. NAVBAR SCROLL EFFECT
===================================================== */

const navbar = document.querySelector(".navbar");

function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();


/* =====================================================
   3. ACTIVE NAVIGATION LINK
===================================================== */

const navLinks = document.querySelectorAll("#navMenu a");
const pageSections = document.querySelectorAll(
    "section[id]:not(#home)"
);

function updateActiveNavigation() {
    let currentSection = "home";

    pageSections.forEach(function (section) {
        if (window.scrollY >= section.offsetTop - 160) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(function (link) {
        const href = link.getAttribute("href");

        link.classList.toggle(
            "active",
            href === "#" + currentSection
        );
    });
}

window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);


/* =====================================================
   4. HERO SLIDER
   Automatic slides and clickable dots
===================================================== */

const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dots .dot");

let currentHeroSlide = 0;
let heroTimer = null;
const heroInterval = 5000;


/* Display a particular slide */

function showHeroSlide(index) {
    if (heroSlides.length === 0) return;

    currentHeroSlide =
        (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle(
            "active",
            slideIndex === currentHeroSlide
        );
    });

    heroDots.forEach(function (dot, dotIndex) {
        dot.classList.toggle(
            "active",
            dotIndex === currentHeroSlide
        );

        dot.setAttribute(
            "aria-pressed",
            String(dotIndex === currentHeroSlide)
        );
    });
}


/* Show the next slide */

function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
}


/* Start automatic sliding */

function startHeroTimer() {
    if (heroSlides.length <= 1) return;

    clearInterval(heroTimer);

    heroTimer = setInterval(function () {
        nextHeroSlide();
    }, heroInterval);
}


/* Restart timer after manual navigation */

function restartHeroTimer() {
    clearInterval(heroTimer);
    startHeroTimer();
}


/* Clickable slider dots */

heroDots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
        showHeroSlide(index);
        restartHeroTimer();
    });
});


/* Initialize slider */

if (heroSlides.length > 0) {
    showHeroSlide(0);
    startHeroTimer();
}


/* =====================================================
   5. MOBILE HERO SWIPE
===================================================== */

const heroSlider = document.querySelector(".hero");

let touchStartX = 0;
let touchEndX = 0;

if (heroSlider && heroSlides.length > 1) {
    heroSlider.addEventListener(
        "touchstart",
        function (event) {
            touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    heroSlider.addEventListener(
        "touchend",
        function (event) {
            touchEndX = event.changedTouches[0].screenX;

            const distance = touchStartX - touchEndX;

            if (Math.abs(distance) < 50) return;

            if (distance > 0) {
                nextHeroSlide();
            } else {
                showHeroSlide(currentHeroSlide - 1);
            }

            restartHeroTimer();
        },
        { passive: true }
    );
}


/* =====================================================
   6. BACK TO TOP BUTTON
===================================================== */

const backTop = document.getElementById("backTop");

function updateBackTop() {
    if (!backTop) return;

    backTop.classList.toggle("show", window.scrollY > 500);
}

if (backTop) {
    window.addEventListener(
        "scroll",
        updateBackTop,
        { passive: true }
    );

    backTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateBackTop();
}


/* =====================================================
   7. CONTACT FORM
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
                "Your form is valid. Email or database submission must be connected to a backend.";
        }
    });
}




/* =====================================================
   PRODUCT CARD CLICK
===================================================== */


const productCards = document.querySelectorAll(".product-card");

productCards.forEach(function (card) {
    card.addEventListener("click", function (event) {

        // Allow product links to navigate to their respective pages.
        if (event.target.closest("a")) {
            return;
        }

        // Only scroll to the contact section when clicking
        // a non-link area of the product card.
        const contactSection = document.getElementById("contact");

        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});



/* =====================================================
   HERO SLIDER
   AUTO SLIDE + DOTS + SWIPE
   NO ARROWS
===================================================== */

const heroSlides =
    document.querySelectorAll(".hero-slide");

const heroDots =
    document.querySelectorAll(".hero-dots .dot");


let currentHeroSlide = 0;

let heroTimer = null;


/* =====================================================
   SHOW HERO SLIDE
===================================================== */

function showHeroSlide(index) {

    /*
       Stop if there are no slides
    */

    if (heroSlides.length === 0) {
        return;
    }


    /*
       Keep index within range
    */

    if (index >= heroSlides.length) {

        index = 0;

    }

    if (index < 0) {

        index =
            heroSlides.length - 1;

    }


    /*
       Remove active class
       from all slides
    */

    heroSlides.forEach(function (slide) {

        slide.classList.remove("active");

    });


    /*
       Remove active class
       from all dots
    */

    heroDots.forEach(function (dot) {

        dot.classList.remove("active");

    });


    /*
       Activate selected slide
    */

    heroSlides[index].classList.add("active");


    /*
       Activate selected dot
    */

    if (heroDots[index]) {

        heroDots[index].classList.add("active");

    }


    /*
       Update current slide
    */

    currentHeroSlide = index;

}


/* =====================================================
   NEXT HERO SLIDE
===================================================== */

function nextHeroSlide() {

    if (heroSlides.length === 0) {
        return;
    }


    let nextSlide =
        currentHeroSlide + 1;


    if (nextSlide >= heroSlides.length) {

        nextSlide = 0;

    }


    showHeroSlide(nextSlide);

}


/* =====================================================
   START HERO TIMER
===================================================== */

function startHeroTimer() {

    /*
       Clear previous timer
       to avoid duplicate intervals
    */

    clearInterval(heroTimer);


    /*
       Change slide every 5 seconds
    */

    heroTimer = setInterval(function () {

        nextHeroSlide();

    }, 5000);

}


/* =====================================================
   RESTART HERO TIMER
===================================================== */

function restartHeroTimer() {

    clearInterval(heroTimer);

    startHeroTimer();

}


/* =====================================================
   HERO DOT NAVIGATION
===================================================== */

heroDots.forEach(function (dot, index) {

    dot.addEventListener("click", function () {

        showHeroSlide(index);

        /*
           Restart the 5-second timer
           after manual selection
        */

        restartHeroTimer();

    });

});


/* =====================================================
   HERO SWIPE / DRAG SUPPORT
===================================================== */

const heroSlider =
    document.querySelector(".hero");


let touchStartX = 0;

let touchEndX = 0;


/*
   Mobile touch start
*/

if (heroSlider) {

    heroSlider.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    /*
       Mobile touch end
    */

    heroSlider.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;

            handleHeroSwipe();

        },
        { passive: true }
    );

}


/* =====================================================
   HANDLE HERO SWIPE
===================================================== */

function handleHeroSwipe() {

    const swipeDistance =
        touchStartX - touchEndX;


    /*
       Ignore very small movements
    */

    if (Math.abs(swipeDistance) < 50) {
        return;
    }


    /*
       Swipe left
       = next slide
    */

    if (swipeDistance > 50) {

        nextHeroSlide();

        restartHeroTimer();

    }


    /*
       Swipe right
       = previous slide
    */

    else if (swipeDistance < -50) {

        let previousSlide =
            currentHeroSlide - 1;


        if (previousSlide < 0) {

            previousSlide =
                heroSlides.length - 1;

        }


        showHeroSlide(previousSlide);

        restartHeroTimer();

    }

}


/* =====================================================
   HERO INITIALIZATION
===================================================== */

if (heroSlides.length > 0) {

    /*
       Show first slide
    */

    showHeroSlide(0);


    /*
       Start automatic sliding
    */

    startHeroTimer();

}


/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */

const navbar =
    document.querySelector(".navbar");


if (navbar) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 30) {

                navbar.classList.add("scrolled");

            } else {

                navbar.classList.remove("scrolled");

            }

        }
    );

}