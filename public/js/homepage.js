$(document).ready(function () {
  // === Modal Events ===
  $(document).on("click", ".close-modal", closeModal);
  $(document).on("click", ".modal-overlay", function (e) {
    if (e.target === this) closeModal();
  });

  // === Load carousel from gigs.json ===
  $.getJSON("../../data/gigs.json", function (data) {
    renderFeaturedCarousel(data);
  });

  // === Load articles from article.json ===
  $.getJSON("../../data/article.json", function (data) {
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
    const card = $(`
      <div class="article-card">
        <img src="${article.image}" alt="${article.title}">
        <div class="article-details">
          <h3 class="article-title">${article.title}</h3>
          <p>${article.summary}</p>
        </div>
      </div>
    `);
    card.data("article", article); // store object safely (allows use of special characters !, é etc.)
    container.append(card);
  });
}

// === What's Happenin ===
function renderWhatsHappenin(articles) {
  const container = $('#whatsHappeninContainer');
  container.empty();

  articles.forEach(article => {
    const card = $(`
      <div class="article-card">
        <h4 class="article-title">${article.title}</h4>
        <p>${article.summary}</p>
      </div>
    `);
    card.data("article", article); // Similar to above, needed to allow safe storage of special character to allow string parsing
    container.append(card);
  });
}

// === Out 'n About Gallery ===
function renderOutnAbout(images) {
  const container = $('#outnAboutImages');
  container.empty();

  images.forEach(img => {
    const item = $(`
      <div class="gallery-item">
        <img src="${img.image}" alt="${img.alt}">
        <p class="caption">${img.caption}</p>
      </div>
    `);
    item.data("image", img); // Same as the others - storing special characters as .data to prevent parsing breaks
    container.append(item);
  });
}

// === Modal Triggers ===
$(document).on("click", ".article-card", function () {
  const article = $(this).data("article");

  if (!article) return;

  // Set modal content
  $("#modalTitle").text(article.title || "No Title");
  $("#modalImage").attr({
    src: article.image || "",
    alt: article.title || ""
  });

  $("#modalMeta").text(`By ${article.author || "Unknown"} – ${article.date || ""}`);

  // Use content or fallback text if empty
  $("#modalBody").html(article.content ? article.content : "<p>No additional content available.</p>");

  // Show modal
  $("#articleModal").fadeIn(200).addClass("show");
});

// Click handler for gallery images
$(document).on("click", ".gallery-item", function () {
  const img = $(this).data("image");
  if (!img) return;

  $("#modalTitle").text(""); // Clear title for gallery images
  $("#modalImage").attr({
    src: img.image || "",
    alt: img.alt || ""
  });
  $("#modalMeta").text("");
  $("#modalBody").html(`<p style="text-align:center; font-style:italic; color: var(--text-muted);">${img.caption || ""}</p>`);

  $("#articleModal").fadeIn(200).addClass("show");
});

// === Modal Functions ===
function closeModal() {
  $("#articleModal").fadeOut(200).removeClass("show");
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
        <img src="${gig.image}" alt="${gig.artist} at ${formatVenueName(gig.venue)}">
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

$(document).on("click", ".modal-content", function (e) {
  e.stopPropagation();
});