/* ==========================================================================
   KAREEM ABIODUN SALIA — PORTFOLIO SCRIPTS
"use strict";


/* ---------- Tiny helper shortcuts ---------- */

// querySelector shortcut: $(".logo") instead of document.querySelector(...)
const $ = (selector, scope = document) => scope.querySelector(selector);

// querySelectorAll shortcut that returns a real array we can loop over
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));


/* ==========================================================
   1. MOBILE NAVIGATION (hamburger)
   ========================================================== */
function setupMobileNav() {
    const hamburger = $("#hamburger");
    const navMenu   = $("#navMenu");
    const navLinks  = $$(".nav-link");

    function openMenu() {
        navMenu.classList.add("open");
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        hamburger.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        navMenu.classList.remove("open");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }

    hamburger.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });


    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });
}


/* ==========================================================
   2. HEADER SHADOW + 3. SCROLL SPY + 4. REVEAL ANIMATIONS
   ========================================================== */
function setupScrollEffects() {
    const header      = $(".site-header");
    const sections    = $$("main section[id]");
    const navLinks    = $$(".nav-link");


    function updateHeaderShadow() {
        header.classList.toggle("scrolled", window.scrollY > 10);
    }

    const spyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    const isMatch = link.getAttribute("href") === "#" + id;
                    link.classList.toggle("active", isMatch);
                });
            });
        },

        { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spyObserver.observe(section));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // animate only once
            });
        },
        { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => revealObserver.observe(el));

    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
    updateHeaderShadow(); // run once on page load
}


/* ==========================================================
   5. LIGHT / DARK THEME TOGGLE
   ========================================================== */
function setupThemeToggle() {
    const toggleButton = $("#themeToggle");

    // Keep the button icon/label in sync with the current theme
    function refreshToggleUI(currentTheme) {
        if (currentTheme === "light") {
            toggleButton.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
            toggleButton.setAttribute("aria-label", "Switch to dark theme");
        } else {
            toggleButton.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
            toggleButton.setAttribute("aria-label", "Switch to light theme");
        }
    }

    toggleButton.addEventListener("click", () => {
        const html       = document.documentElement;
        const newTheme   = html.getAttribute("data-theme") === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);   // remember the choice
        refreshToggleUI(newTheme);
    });

    refreshToggleUI(document.documentElement.getAttribute("data-theme"));
}


/* ==========================================================
   6. BACK-TO-TOP BUTTON
   ========================================================== */
function setupBackToTop() {
    const backToTop = $("#backToTop");

    window.addEventListener(
        "scroll",
        () => backToTop.classList.toggle("visible", window.scrollY > 500),
        { passive: true }
    );

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* ==========================================================
   7. CONTACT FORM VALIDATION
   ========================================================== */


const validationRules = {
    name: (value) => {
        if (value.length < 2)  return "Please enter your full name.";
        if (value.length > 80) return "Name must be under 80 characters.";
        return "";
    },
    email: (value) => {
        // Simple, readable email pattern: something@something.something
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) return "Please enter a valid email address.";
        return "";
    },
    subject: (value) => {
        if (value.length < 3)   return "Subject must be at least 3 characters.";
        if (value.length > 120) return "Subject must be under 120 characters.";
        return "";
    },
    message: (value) => {
        if (value.length < 10)  return "Message must be at least 10 characters long.";
        if (value.length > 1500) return "Message must be under 1500 characters.";
        return "";
    }
};

function setFieldError(input, message) {
    const errorBox = $("#" + input.id + "Error");
    errorBox.textContent = message;
    errorBox.classList.toggle("show", message !== "");
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
}

function setupContactForm() {
    const form      = $("#contactForm");
    const statusBox = $("#formStatus");
    const submitBtn = $("#submitBtn");

    // Validate every field; returns true only when all are valid
    function validateAllFields() {
        let allValid = true;

        Object.keys(validationRules).forEach((fieldName) => {
            const input   = form.elements[fieldName];
            const message = validationRules[fieldName](input.value.trim());
            setFieldError(input, message);
            if (message !== "") allValid = false;
        });

        return allValid;
    }

    ["name", "email", "subject", "message"].forEach((fieldName) => {
        const input = form.elements[fieldName];
        input.addEventListener("blur", () => {
            setFieldError(input, validationRules[fieldName](input.value.trim()));
        });
    });

    // Show the green/red banner under the form
    function showStatus(type, message) {
        statusBox.hidden = false;
        statusBox.className = "form-status " + type;
        statusBox.textContent = message;
    }

    async function handleSubmit(event) {
        event.preventDefault(); // stop the browser's default full-page POST

        if (!validateAllFields()) {
            showStatus("error", "Please fix the highlighted fields and try again.");
            return;
        }

        // Send the data to contact.php without reloading the page
        const data = new FormData(form);
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: data,
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json"
                }
            });
            const result = await response.json();

            if (result.success) {
                showStatus("success", result.message);
                form.reset();
            } else {
                showStatus("error", result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            // Happens e.g. when index.html is opened straight from disk,
            // because PHP needs a server to run.
            showStatus(
                "error",
                "The form could not reach the server. If you opened this file directly, " +
                "please run the site through XAMPP or Live Server (see README.md)."
            );
        } finally {
            submitBtn.disabled = false;
        }
    }

    form.addEventListener("submit", handleSubmit);

    /* Fallback: if JavaScript submission was skipped (e.g. JS disabled),
       contact.php redirects back here with ?status=... in the URL.
       We detect that and show the server's message. */
    const params = new URLSearchParams(window.location.search);
    if (params.has("status")) {
        const success = params.get("status") === "success";
        showStatus(success ? "success" : "error", params.get("msg") ||
            (success ? "Your message was sent." : "Sorry, something went wrong."));
        // Clean the URL so refreshing doesn't re-show the banner
        history.replaceState(null, "", window.location.pathname + "#contact");
    }
}


/* ==========================================================
   8. SMALL EXTRAS
   ========================================================== */
function setupFooterYear() {
    $("#year").textContent = new Date().getFullYear();
}


/* ==========================================================
   START EVERYTHING once the HTML has loaded
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    setupMobileNav();
    setupScrollEffects();
    setupThemeToggle();
    setupBackToTop();
    setupContactForm();
    setupFooterYear();
});
