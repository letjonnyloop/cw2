$(document).ready(function () {
  // === Modal Events ===
  $(document).on("click", ".close-modal", closeModal);
  $(document).on("click", ".modal-overlay", function (e) {
    if (e.target === this) closeModal();
  });

  // === Load carousel from gigs.json ===
  $.getJSON("data/gigs.json", function (data) {
    renderFeaturedCarousel(data);
  });

  // === Load articles from article.json ===
  $.getJSON("data/article.json", function (data) {
    renderLookAtThis(data.lookAtThis);
    renderWhatsHappenin(data.whatsHappenin);
    renderOutnAbout(data.outnAbout);
  });
});

// === Look At This Articles ===
function renderLookAtThis(articles) {
  const container = $('#featuredArticlesContainer');
  container.empty();

  articles.forEach(article => {
    const card = `
      <div class="article-card" data-article='${JSON.stringify(article)}'>
        <img src="${article.image}" alt="${article.title}">
        <div class="article-details">
          <h3>${article.title}</h3>
          <p>${article.summary}</p>
        </div>
      </div>
    `;
    container.append(card);
  });
}

// === What's Happenin ===
function renderWhatsHappenin(articles) {
  const container = $('#whatsHappeninContainer');
  container.empty();

  articles.forEach(article => {
    const item = `
      <div class="article-card" data-article='${JSON.stringify(article)}'>
        <h4>${article.title}</h4>
        <p>${article.summary}</p>
      </div>
    `;
    container.append(item);
  });
}

// === Out 'n About Gallery ===
function renderOutnAbout(images) {
  const container = $('#outnAboutImages');
  container.empty();

  images.forEach(img => {
    const item = `
      <div class="gallery-item" data-image='${JSON.stringify(img)}'>
        <img src="${img.image}" alt="${img.alt}">
        <p class="caption">${img.caption}</p>
      </div>
    `;
    container.append(item);
  });
}

// === Modal Triggers ===
$(document).on("click", ".article-card", function () {
  const article = $(this).data("article");

  const modalHTML = `
    <div class="modal-article">
      <img class="modal-article-image" src="${article.image}" alt="${article.title}">
      <div class="modal-article-content">
        <h2>${article.title}</h2>
        <p class="modal-article-meta"><em>By ${article.author} – ${article.date}</em></p>
        <div class="modal-article-body">
          <p>${article.content}</p>
        </div>
      </div>
    </div>
  `;

  openModal(modalHTML);
});


$(document).on("click", ".gallery-item", function () {
  const img = $(this).data("image");
  const html = `
    <img src="${img.image}" alt="${img.alt}">
    <p style="text-align:center; font-style:italic; color: var(--text-muted);">${img.caption}</p>
  `;
  openModal(html);
});

// === Modal Functions ===
function openModal(contentHTML) {
  $("#modalContent").html(contentHTML); // Ensure your modal has this ID!
  $("#articleModal").fadeIn(200);
}

function closeModal() {
  $("#articleModal").fadeOut(200);
}

// === Featured Carousel ===
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

// === Carousel Rotation ===
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

// === Venue Formatting ===
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
