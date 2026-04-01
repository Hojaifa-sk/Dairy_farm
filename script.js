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
