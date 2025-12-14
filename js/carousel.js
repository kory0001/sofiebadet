// Reviews Carousel
class ReviewsCarousel {
  constructor() {
    this.track = document.querySelector(".reviews__track");
    this.cards = Array.from(document.querySelectorAll(".reviews__card"));
    this.prevButton = document.querySelector(".reviews__arrows .reviews__arrow--prev");
    this.nextButton = document.querySelector(".reviews__arrows .reviews__arrow--next");
    this.trackContainer = document.querySelector(".reviews__track-container");

    this.currentIndex = 0;
    this.cardsToShow = this.getCardsToShow();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);

    this.init();
  }

  init() {
    if (!this.track || this.cards.length === 0) return;

    // Event listeners for arrows
    this.prevButton?.addEventListener("click", () => this.prev());
    this.nextButton?.addEventListener("click", () => this.next());

    // Touch support for mobile
    this.addTouchSupport();

    // Window resize handler
    window.addEventListener("resize", () => this.handleResize());

    // Initial state
    this.updateCarousel();
  }

  getCardsToShow() {
    const width = window.innerWidth;
    if (width < 769) return 1; // Mobile: 1 card
    if (width < 1025) return 2; // Tablet: 2 cards
    return 3; // Desktop: 3 cards
  }

  handleResize() {
    const newCardsToShow = this.getCardsToShow();
    if (newCardsToShow !== this.cardsToShow) {
      this.cardsToShow = newCardsToShow;
      this.maxIndex = Math.max(0, this.cards.length - this.cardsToShow);

      // Adjust current index if needed
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }

      this.updateCarousel();
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    if (!this.track || this.cards.length === 0) return;

    // Calculate card width including gap
    const firstCard = this.cards[0];
    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(getComputedStyle(this.track).gap) || 0;
    const moveAmount = (cardWidth + gap) * this.currentIndex;

    // Move the track
    this.track.style.transform = `translateX(-${moveAmount}px)`;

    // Update button states
    this.updateButtons();
  }

  updateButtons() {
    if (!this.prevButton || !this.nextButton) return;

    // Disable/enable prev button
    this.prevButton.disabled = this.currentIndex === 0;

    // Disable/enable next button
    this.nextButton.disabled = this.currentIndex >= this.maxIndex;
  }

  addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    // Touch support on track container
    this.trackContainer?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.trackContainer?.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      },
      { passive: true }
    );
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next
        this.next();
      } else {
        // Swiped right - go to prev
        this.prev();
      }
    }
  }
}

// Initialize carousel when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ReviewsCarousel();
  });
} else {
  new ReviewsCarousel();
}
