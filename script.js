const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));

const slider = document.querySelector("[data-slider]");

if (slider) {
  const slides = Array.from(slider.querySelectorAll(".testimonial"));
  const dots = Array.from(slider.querySelectorAll("[data-dot]"));
  const prev = slider.querySelector("[data-prev]");
  const next = slider.querySelector("[data-next]");
  let index = 0;
  let intervalId;

  const updateSlider = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  const startAutoPlay = () => {
    intervalId = window.setInterval(() => updateSlider(index + 1), 4500);
  };

  const resetAutoPlay = () => {
    window.clearInterval(intervalId);
    startAutoPlay();
  };

  prev?.addEventListener("click", () => {
    updateSlider(index - 1);
    resetAutoPlay();
  });

  next?.addEventListener("click", () => {
    updateSlider(index + 1);
    resetAutoPlay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      updateSlider(dotIndex);
      resetAutoPlay();
    });
  });

  updateSlider(0);
  startAutoPlay();
}

const clientForm = document.querySelector("[data-client-form]");
const formSuccess = document.querySelector("[data-form-success]");

if (clientForm && formSuccess) {
  clientForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formSuccess.hidden = false;
    clientForm.reset();
    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

const reviewForm = document.querySelector("[data-review-form]");
const reviewSuccess = document.querySelector("[data-review-success]");
const averageRating = document.querySelector("[data-average-rating]");
const averageStars = document.querySelector("[data-average-stars]");
const reviewCount = document.querySelector("[data-review-count]");
const liveReviews = document.querySelector("[data-live-reviews]");
const liveReviewTotal = document.querySelector("[data-live-review-total]");
const ratingInput = document.querySelector("[data-rating-input]");
const starButtons = Array.from(document.querySelectorAll(".star-button"));

const defaultReviews = [
  {
    name: "Ather Hossain",
    rating: 5,
    review: "The Best Cattle Farm with a very trustworthy local reputation.",
  },
  {
    name: "Mumtaz Ali",
    rating: 5,
    review: "Best quality milk and cattle farming with healthy livestock care.",
  },
  {
    name: "Local customer",
    rating: 5,
    review: "Great place for Qurbani cows and livestock.",
  },
];

const storageKey = "bismillah-dairy-farm-reviews";

const loadReviews = () => {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return [...defaultReviews];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultReviews];
  } catch {
    return [...defaultReviews];
  }
};

const saveReviews = (reviews) => {
  window.localStorage.setItem(storageKey, JSON.stringify(reviews));
};

const starsFor = (rating) => "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const setActiveStars = (rating) => {
  starButtons.forEach((button) => {
    const value = Number(button.dataset.star);
    button.classList.toggle("active", value <= rating);
  });

  if (ratingInput) {
    ratingInput.value = String(rating);
  }
};

const renderReviews = (reviews) => {
  if (!averageRating || !averageStars || !reviewCount || !liveReviews || !liveReviewTotal) {
    return;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = (total / reviews.length).toFixed(1);

  averageRating.textContent = average;
  averageStars.textContent = starsFor(Math.round(Number(average)));
  reviewCount.textContent = `Based on ${reviews.length} customer reviews`;

  const recent = [...reviews].reverse().slice(0, 4);
  liveReviews.innerHTML = recent
    .map(
      (review) => `
        <article class="live-review-item">
          <strong>${escapeHtml(review.name)}</strong>
          <span>${starsFor(review.rating)}</span>
          <p>${escapeHtml(review.review)}</p>
        </article>
      `
    )
    .join("");

  liveReviewTotal.textContent = `${recent.length} shown`;
};

let submittedReviews = loadReviews();
renderReviews(submittedReviews);
setActiveStars(Number(ratingInput?.value || 5));

starButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveStars(Number(button.dataset.star));
  });
});

if (reviewForm && reviewSuccess && ratingInput) {
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewForm);
    const entry = {
      name: String(formData.get("name") || "Website visitor").trim(),
      rating: Number(formData.get("rating") || 5),
      review: String(formData.get("review") || "").trim(),
    };

    if (!entry.name || !entry.review) {
      return;
    }

    submittedReviews = [...submittedReviews, entry];
    saveReviews(submittedReviews);
    renderReviews(submittedReviews);
    reviewForm.reset();
    setActiveStars(5);
    reviewSuccess.hidden = false;
    reviewSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
