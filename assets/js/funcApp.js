// ===== NAV TOGGLE (mobile hamburger) =====
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// ===== INIT ALL SLIDERS =====
document.querySelectorAll(".slider-vid").forEach(initSlider);

function initSlider(container) {
  const slidesWrapper = container.querySelector(".slides");
  if (!slidesWrapper) return;

  const slideItems = Array.from(slidesWrapper.querySelectorAll(".slide"));
  if (!slideItems.length) return;

  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const dotsContainer = container.querySelector(".dots");
  let index = 0;
  let autoplayInterval;

  // Build dots
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
    // Pause all videos
    slideItems.forEach(slide => {
      const v = slide.querySelector("video");
      if (v) { v.pause(); v.currentTime = 0; }
    });

    slidesWrapper.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");

    clearInterval(autoplayInterval);
    const currentVideo = slideItems[index].querySelector("video");
    if (currentVideo) {
      // advance after video ends
      currentVideo.addEventListener("ended", () => {
        index = (index + 1) % slideItems.length;
        updateSlider();
      }, { once: true });
    } else {
      startAutoplay();
    }
  }

  function goToSlide(i) {
    index = i;
    updateSlider();
  }

  function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
      index = (index + 1) % slideItems.length;
      updateSlider();
    }, 5000);
  }

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slideItems.length) % slideItems.length;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slideItems.length;
    updateSlider();
  });

  // ===== TOUCH / SWIPE =====
  let touchStartX = 0;
  let touchStartY = 0;

  slidesWrapper.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  slidesWrapper.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        index = (index + 1) % slideItems.length;
      } else {
        index = (index - 1 + slideItems.length) % slideItems.length;
      }
      updateSlider();
    }
  }, { passive: true });

  // Init
  updateSlider();

  // Lightbox on image double-tap / dblclick
  const sliderImages = Array.from(container.querySelectorAll("img"));
  sliderImages.forEach((img, i) => {
    img.addEventListener("dblclick", () => openLightbox(sliderImages, i));
  });
}

// ===== LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const closeBtn = lightbox.querySelector(".close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");

let currentImages = [];
let currentImgIndex = 0;

function openLightbox(images, startIndex) {
  currentImages = images;
  currentImgIndex = startIndex;
  lightbox.style.display = "flex";
  lightboxImg.src = currentImages[currentImgIndex].src;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener("click", () => {
  currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
  lightboxImg.src = currentImages[currentImgIndex].src;
});

lightboxNext.addEventListener("click", () => {
  currentImgIndex = (currentImgIndex + 1) % currentImages.length;
  lightboxImg.src = currentImages[currentImgIndex].src;
});

// Keyboard nav for lightbox
document.addEventListener("keydown", e => {
  if (lightbox.style.display !== "flex") return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxPrev.click();
  if (e.key === "ArrowRight") lightboxNext.click();
});
