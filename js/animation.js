// ==========================================
// SCROLL ANIMATIONS - FADE IN
// ==========================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(".fade-in");
    this.init();
  }

  init() {
    // Observer options
    const options = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };

    // Create observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.elements.forEach((el) => {
      this.observer.observe(el);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ScrollAnimations();
  });
} else {
  new ScrollAnimations();
}
