// ==========================
// Navbar Active State
// ==========================
const navLinks = document.querySelectorAll('.nav_link');
navLinks.forEach(navLink => {
  navLink.addEventListener('click', () => {
    document.querySelector('.active')?.classList.remove('active');
    navLink.classList.add('active');
  });
});

// ==========================
// Initialize Sliders (only if slides exist)
// ==========================
document.querySelectorAll(
  ".hero-vid, .browser-vid, .rk-vid, .may-vid, .june-vid, .july-vid, .aug-vid"
).forEach(initSlider);

function initSlider(container) {
  const slides = container.querySelector(".slides");
  if (!slides) return; // skip if no slides

  const slideItems = slides.querySelectorAll(".slide");
  if (!slideItems.length) return; // skip if empty

  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");
  const dotsContainer = container.querySelector(".dots");

  // Hide arrows/dots if 1 or less slides
  if (slideItems.length <= 1) {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
    if (dotsContainer) dotsContainer.style.display = "none";
    return;
  }

  if (!prevBtn || !nextBtn || !dotsContainer) return;

  let index = 0;

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
    slides.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
    // ✅ No autoplay, no reset — videos just sit there
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

  // Mobile swipe support
  function setupMobileSlider() {
    if (window.innerWidth > 768) {
      prevBtn.style.opacity = '';
      nextBtn.style.opacity = '';
      dotsContainer.style.display = '';
      return;
    }

    prevBtn.style.opacity = 0;
    nextBtn.style.opacity = 0;

    let touchTimeout;
    slides.addEventListener("touchstart", () => {
      prevBtn.style.opacity = 1;
      nextBtn.style.opacity = 1;
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        prevBtn.style.opacity = 0;
        nextBtn.style.opacity = 0;
      }, 2000);
    });

    let touchStartX = 0;
    let touchEndX = 0;

    slides.addEventListener("touchstart", e => { 
      touchStartX = e.changedTouches[0].screenX; 
    });
    slides.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance > 50) {
        index = (index - 1 + slideItems.length) % slideItems.length;
        updateSlider();
      } else if (swipeDistance < -50) {
        index = (index + 1) % slideItems.length;
        updateSlider();
      }
    });

    dotsContainer.style.display = slideItems.length <= 1 ? "none" : "flex";
  }

  setupMobileSlider();
  window.addEventListener('resize', setupMobileSlider);

  updateSlider();
}

// ==========================
// Global Lightbox (for images only)
// ==========================
const lightbox = document.getElementById("lightbox");
if (lightbox) {
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
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightboxImage();
  }

  function showNextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightboxImage();
  }

  // Lightbox events
  closeBtn.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrevImage);
  lightboxNext.addEventListener("click", showNextImage);
  lightbox.addEventListener("click", e => { 
    if (e.target === lightbox) closeLightbox(); 
  });

  // Bind double-click for images only
  document.querySelectorAll(".slides img").forEach((img, i, arr) => {
    img.addEventListener("dblclick", () => openLightbox(arr, i));
  });
}

// ==========================
// Show more / Show less
// ==========================
document.querySelectorAll(".toggle-desc").forEach(btn => {
  btn.addEventListener("click", () => {
    const desc = btn.previousElementSibling;
    desc.classList.toggle("expanded");
    btn.textContent = desc.classList.contains("expanded") ? "Show less" : "Show more";
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
