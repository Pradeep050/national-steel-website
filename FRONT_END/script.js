/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", function () {

        navMenu.classList.toggle("open");

        const icon = menuBtn.querySelector("i");

        if (icon) {

            if (navMenu.classList.contains("open")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

}


/* =====================================================
   CLOSE MOBILE MENU
===================================================== */

const navLinks = document.querySelectorAll("#navMenu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navMenu) {
            navMenu.classList.remove("open");
        }

        if (menuBtn) {

            const icon = menuBtn.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section[id]");

function updateActiveNavigation() {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");

        if (
            currentSection &&
            link.getAttribute("href") === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* =====================================================
   BACK TO TOP
===================================================== */

const backTop =
    document.getElementById("backTop");

if (backTop) {

    window.addEventListener("scroll", function () {

        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    });


    backTop.addEventListener("click", function () {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}


/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nameElement =
                document.getElementById("name");

            const phoneElement =
                document.getElementById("phone");

            const emailElement =
                document.getElementById("email");

            const messageElement =
                document.getElementById("message");


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";

            const phone =
                phoneElement
                    ? phoneElement.value.trim()
                    : "";

            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";

            const message =
                messageElement
                    ? messageElement.value.trim()
                    : "";


            if (
                name === "" ||
                phone === "" ||
                email === "" ||
                message === ""
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please fill all required fields.";

                }

                return;

            }


            if (formMessage) {

                formMessage.textContent =
                    "Thank you! Your enquiry has been submitted.";

            }


            contactForm.reset();

        }
    );

}


/* =====================================================
   PRODUCT CARD CLICK
===================================================== */

const productCards =
    document.querySelectorAll(".product-card");


productCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const contactSection =
            document.getElementById("contact");

        if (contactSection) {

            contactSection.scrollIntoView({

                behavior: "smooth"

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