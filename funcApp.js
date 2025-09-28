// ==========================
// Navbar Active State
// ==========================
const navLinks = document.querySelectorAll('.nav_link');
navLinks.forEach(navLink => {
  navLink.addEventListener('click', () => {
    document.querySelector('.active').classList.remove('active');
    navLink.classList.add('active');
  });
});

// ==========================
// Initialize All Sliders
// ==========================
document.querySelectorAll(
  ".hero-vid, .browser-vid, .rk-vid, .may-vid, .june-vid, .july-vid, .aug-vid"
).forEach(initSlider);

function initSlider(container) {
  const slides = container.querySelector(".slides");
  if (!slides) return;

  const slideItems = slides.querySelectorAll(".slide");
  if (!slideItems.length) return;

  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const dotsContainer = container.querySelector(".dots");

  // ✅ Hide arrows + dots if only one slide
  if (slideItems.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (dotsContainer) dotsContainer.style.display = "none";
    return; // stop init, nothing to slide
  }

  if (!prevBtn || !nextBtn || !dotsContainer) return;

  let index = 0;
  let autoplayInterval;

  // ==========================
  // Create dots dynamically
  // ==========================
  dotsContainer.innerHTML = "";
  slideItems.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll(".dot");

  // ==========================
  // Update slider display
  // ==========================
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

    slides.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");

    // Autoplay for videos/images
    clearInterval(autoplayInterval);
    if (video) {
      video.play();
      video.addEventListener("ended", () => startAutoplay(), { once: true });
    } else {
      startAutoplay();
    }
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

  // ==========================
  // Mobile Swipe & Arrows/Dots
  // ==========================
  function setupMobileSlider() {
    if (window.innerWidth > 768) {
      prevBtn.style.opacity = '';
      nextBtn.style.opacity = '';
      dotsContainer.style.display = '';
      return;
    }

    // Arrows hidden by default
    prevBtn.style.opacity = 0;
    nextBtn.style.opacity = 0;

    // Show arrows temporarily on touch
    let touchTimeout;
    slides.addEventListener("touchstart", () => {
      prevBtn.style.opacity = 1;
      nextBtn.style.opacity = 1;

      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        prevBtn.style.opacity = 0;
        nextBtn.style.opacity = 0;
      }, 2000); // hide after 2s
    });

    // Swipe handling
    let touchStartX = 0;
    let touchEndX = 0;

    slides.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slides.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      const minSwipe = 50;

      if (swipeDistance > minSwipe) {
        index = (index - 1 + slideItems.length) % slideItems.length;
        updateSlider();
      } else if (swipeDistance < -minSwipe) {
        index = (index + 1) % slideItems.length;
        updateSlider();
      }
    });

    // Dots visibility
    if (slideItems.length <= 1) {
      dotsContainer.style.display = "none";
    } else {
      dotsContainer.style.display = "flex";
    }
  }

  // Run mobile setup on init + resize
  setupMobileSlider();
  window.addEventListener('resize', setupMobileSlider);

  // ==========================
  // Init slider
  // ==========================
  updateSlider();

  // ==========================
  // Lightbox for this slider
  // ==========================
  const sliderImages = Array.from(container.querySelectorAll("img"));
  sliderImages.forEach((img, i) => {
    img.addEventListener("dblclick", () => openLightbox(sliderImages, i));
  });
}

// ==========================
// Global Lightbox
// ==========================
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

// Lightbox events
closeBtn.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevImage);
lightboxNext.addEventListener("click", showNextImage);
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// ==========================
// Show more / Show less
// ==========================
document.querySelectorAll(".toggle-desc").forEach(btn => {
  btn.addEventListener("click", () => {
    const desc = btn.previousElementSibling;
    desc.classList.toggle("expanded");

    btn.textContent = desc.classList.contains("expanded")
      ? "Show less"
      : "Show more";
  });
});

// ==========================
// Adjust Mobile Nav Width
// ==========================
function adjustMobileNav() {
  const navLinks = document.querySelectorAll('.nav_link');
  const container = document.querySelector('.topMain');

  if (window.innerWidth <= 768) {
    const containerWidth = container.offsetWidth;
    const numLinks = navLinks.length;
    const linkWidth = Math.floor(containerWidth / numLinks) - 4;
    navLinks.forEach(link => link.style.width = linkWidth + 'px');
  } else {
    navLinks.forEach(link => link.style.width = '');
  }
}

window.addEventListener('load', adjustMobileNav);
window.addEventListener('resize', adjustMobileNav);
