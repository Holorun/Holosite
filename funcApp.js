// Navbar active state
const navLinks = document.querySelectorAll('.nav_link');
navLinks.forEach(navLink => {
  navLink.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active');
    navLink.classList.add('active');
  });
});

// Init sliders (Browser + RK + May + June + July + Aug)
document.querySelectorAll(
  ".hero-vid, .browser-vid, .RK-vid, .May-vid, .June-vid, .July-vid, .Aug-vid"
).forEach(initSlider);

function initSlider(container) {
  // find the slides wrapper inside this container
  const slides = container.querySelector(
    ".slides, .RK-slides, .May-slides, .June-slides, .July-slides, .Aug-slides"
  );
  if (!slides) return;

  // find slide items (generic)
  const slideItems = slides.querySelectorAll(
    ".slide, .RK-slide, .May-slide, .June-slide, .July-slide, .Aug-slide"
  );
  if (!slideItems.length) return;

  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const dotsContainer = container.querySelector(".dots");
  let index = 0;
  let autoplayInterval;

  // Create dots dynamically
  dotsContainer.innerHTML = "";
  slideItems.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll(".dot");

  function updateSlider() {
    // Pause + reset all videos
    slideItems.forEach(slide => {
      const video = slide.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const currentSlide = slideItems[index];
    const video = currentSlide.querySelector("video");

    if (video) {
      slides.style.transition = "none";
      clearInterval(autoplayInterval);
      video.addEventListener("ended", () => startAutoplay(), { once: true });
    } else {
      slides.style.transition = "transform 0.5s ease-in-out";
      startAutoplay();
    }

    slides.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function goToSlide(i) {
    index = i;
    updateSlider();
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slideItems.length) % slideItems.length;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slideItems.length;
    updateSlider();
  });

  function startAutoplay() {
    clearInterval(autoplayInterval);
    const currentSlide = slideItems[index];
    const video = currentSlide.querySelector("video");
    if (!video) {
      autoplayInterval = setInterval(() => {
        index = (index + 1) % slideItems.length;
        updateSlider();
      }, 5000);
    }
  }

  // Init
  updateSlider();
  startAutoplay();

  // Lightbox (only this slider's images)
  const sliderImages = Array.from(container.querySelectorAll("img"));
  sliderImages.forEach((img, i) => {
    img.addEventListener("dblclick", () => {
      openLightbox(sliderImages, i);
    });
  });
}

// ==================
// Global Lightbox
// ==================
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const closeBtn = lightbox.querySelector(".close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");

let currentLightboxImages = [];
let currentLightboxIndex = 0;

function openLightbox(images, startIndex) {
  currentLightboxImages = images;
  currentLightboxIndex = startIndex;
  lightbox.style.display = "flex";
  updateLightboxImage();
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function updateLightboxImage() {
  lightboxImg.src = currentLightboxImages[currentLightboxIndex].src;
}

function showPrevImage() {
  currentLightboxIndex =
    (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxImage();
}

function showNextImage() {
  currentLightboxIndex =
    (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightboxImage();
}

// Events
closeBtn.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevImage);
lightboxNext.addEventListener("click", showNextImage);
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});



const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
