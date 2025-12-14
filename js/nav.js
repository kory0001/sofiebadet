// =====================================================
// NAVIGATION FUNCTIONALITY - SOFIEBADET
// =====================================================
class Navigation {
  constructor() {
    this.burger = document.querySelector(".navbar__burger");
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.languageToggle = document.querySelector(".navbar__language-toggle"); // ← RETTET
    this.languageContainer = document.querySelector(".navbar__language");
    this.body = document.body;
    this.init();
  }

  init() {
    // Burger menu toggle
    if (this.burger && this.mobileMenu) {
      this.burger.addEventListener("click", () => this.toggleMobileMenu());
    }

    // Language dropdown toggle
    if (this.languageToggle && this.languageContainer) {
      this.languageToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleLanguageDropdown();
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!this.languageContainer.contains(e.target)) {
          this.languageContainer.classList.remove("active");
        }
      });
    }

    // Language selection
    const langLinks = document.querySelectorAll("[data-lang]");
    langLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.changeLanguage(link.dataset.lang);
      });
    });

    // Close mobile menu when clicking menu links
    const mobileLinks = document.querySelectorAll(".mobile-menu__link");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    });
  }

  toggleMobileMenu() {
    this.burger.classList.toggle("active");
    this.mobileMenu.classList.toggle("active");
    this.body.classList.toggle("menu-open");
  }

  closeMobileMenu() {
    this.burger.classList.remove("active");
    this.mobileMenu.classList.remove("active");
    this.body.classList.remove("menu-open");
  }

  toggleLanguageDropdown() {
    this.languageContainer.classList.toggle("active");
  }

  changeLanguage(lang) {
    console.log(`Language changed to: ${lang}`); // ← RETTET

    // Update button text
    this.languageToggle.childNodes[0].textContent = lang.toUpperCase() + " ";

    // Close dropdown
    this.languageContainer.classList.remove("active");
  }
}

// Initialize navigation when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "var(--shadow-md)";
  } else {
    navbar.style.boxShadow = "none";
  }
});
