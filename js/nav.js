// =====================================================
// NAVIGATION FUNCTIONALITY - SOFIEBADET
// =====================================================

class Navigation {
  constructor() {
    this.burger = document.querySelector(".navbar__burger");
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.languageToggle = document.querySelector(".language-toggle");
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

    // Prevent scroll when mobile menu is open
    this.preventScrollWhenMenuOpen();
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
    console.log(`Language changed to: ${lang}`);
    // Her kan du implementere faktisk sprogskift
    // For nu logger vi bare til konsollen

    // Update button text
    this.languageToggle.childNodes[0].textContent = lang.toUpperCase() + " ";

    // Close dropdown
    this.languageContainer.classList.remove("active");

    // Her ville du normalt:
    // - Opdatere URL (f.eks. /da/ eller /en/)
    // - Loade translations
    // - Opdatere content
  }

  preventScrollWhenMenuOpen() {
    // Prevent body scroll when mobile menu is open
    const style = document.createElement("style");
    style.innerHTML = `
            body.menu-open {
                overflow: hidden;
            }
        `;
    document.head.appendChild(style);
  }
}

// Initialize navigation when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
});

// Optional: Add scroll behavior for navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 12px rgba(50, 22, 0, 0.15)";
  } else {
    navbar.style.boxShadow = "0 2px 8px rgba(50, 22, 0, 0.1)";
  }
});
