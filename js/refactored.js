$(document).ready(function () {
  // === Load carousel from gigs.json ===
  $.getJSON("data/gigs.json", function (data) {
    renderFeaturedCarousel(data);
  });

  // === Load articles from article.json ===
  $.getJSON("data/article.json", function (data) {
    // Look At This
    data.lookAtThis.forEach(article => {
      const card = `
        <div class="article-card">
          <img src="${article.image}" alt="${article.title}">
          <div class="article-content">
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
          </div>
        </div>
      `;
      $('#featuredArticlesContainer').append(card);
    });

    // What's Happenin'
    data.whatsHappenin.forEach(article => {
      const item = `
        <div class="article-list-item">
          <h4>${article.title}</h4>
          <p>${article.summary}</p>
        </div>
      `;
      $('#whatsHappeninContainer').append(item);
    });

    // Out 'n About Gallery
    data.outnAbout.forEach(photo => {
      const image = `
        <img src="${photo.image}" alt="${photo.alt}" title="${photo.caption}">
      `;
      $('#outnAboutImages').append(image);
    });
  });
});


// === Featured Carousel from gigs.json ===
function renderFeaturedCarousel(data) {
  const featuredGigs = data.filter(gig => gig.featured);
  const carousel = $(".carousel");
  carousel.empty();

  if (featuredGigs.length === 0) {
    carousel.append("<p>No featured events right now. Check back soon!</p>");
    return;
  }

  featuredGigs.forEach((gig, index) => {
    const slide = `
      <div class="slide ${index === 0 ? "active" : ""}">
        <img src="images/${gig.image}" alt="${gig.artist} at ${formatVenueName(gig.venue)}">
        <div class="overlay">
          <h2>${gig.artist} – ${formatVenueName(gig.venue)}</h2>
          <p>${gig.date}</p>
        </div>
      </div>
    `;
    carousel.append(slide);
  });

  rotateSlides();
}


// === Auto-Rotate Carousel Slides ===
function rotateSlides() {
  let currentIndex = 0;
  const slides = $(".carousel .slide");

  if (slides.length <= 1) return;

  setInterval(() => {
    slides.eq(currentIndex).removeClass("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides.eq(currentIndex).addClass("active");
  }, 5000);
}


// === Helper: Format Venue Name ===
function formatVenueName(key) {
  switch (key) {
    case "customhouse": return "Custom House Square";
    case "empire": return "Empire Music Hall";
    case "limelight": return "LimeLight";
    case "mandela": return "Mandela Hall";
    case "ohyeah": return "Oh Yeah Music Centre";
    case "voodoo": return "Voodoo";
    default: return key;
  }
}
