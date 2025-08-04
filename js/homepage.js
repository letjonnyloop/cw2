let gigsData = [];
let gigsPerPage = 6;
let currentIndex = 0;
let filteredGigs = [];

$(document).ready(function () {
  // Load gigs from JSON
  $.getJSON("data/gigs.json", function (data) {
    gigsData = data;

    renderFeaturedCarousel(gigsData);

    filteredGigs = gigsData; // Initialize filtered gigs with full list
    currentIndex = 0;
    displayGigsPaginated(filteredGigs, currentIndex, gigsPerPage);
  });

  // Attach filter handlers
  $("#venueFilter, #dateFilter, #searchBoth, #genre-filter").on("input change", () => {
    currentIndex = 0; // Reset pagination index on filter change
    applyFilters();
  });

  $("#clearFilters").on("click", function () {
    $("#venueFilter").val('');
    $("#dateFilter").val('');
    $("#searchBoth").val('');
    $("#genre-filter").val('');
    filteredGigs = gigsData;
    currentIndex = 0;
    displayGigsPaginated(filteredGigs, currentIndex, gigsPerPage);
  });

  // Load More button handler
  $("#loadMoreBtn").on("click", function () {
    currentIndex += gigsPerPage;
    displayGigsPaginated(filteredGigs, currentIndex, gigsPerPage, true);
  });

  // jQuery UI Date Picker
  $("#dateFilter").datepicker({ dateFormat: "dd/mm/yy" });
});

// 🎸 Display gigs in paginated chunks, append if 'append' true
function displayGigsPaginated(gigs, start, count, append = false) {
  const gigList = $("#gigList");
  const gigsToShow = gigs.slice(start, start + count);

  if (!append) gigList.empty();

  if (gigsToShow.length === 0 && !append) {
    gigList.append("<p>No gigs match your filters. Try adjusting your search.</p>");
    $("#loadMoreBtn").hide();
    return;
  }

  gigsToShow.forEach(gig => {
    const card = `
      <div class="gig-card">
        <img src="images/${gig.image}" alt="${gig.artist} performing">
        <div class="gig-info">
          <h3>${gig.artist}</h3>
          <p><strong>Venue:</strong> ${formatVenueName(gig.venue)}</p>
          <p><strong>Date:</strong> ${gig.date}</p>
          <p><strong>Genre:</strong> ${capitalize(gig.genre)}</p>
        </div>
      </div>
    `;
    gigList.append(card);
  });

  // Show or hide Load More button
  if (start + count >= gigs.length) {
    $("#loadMoreBtn").hide();
  } else {
    $("#loadMoreBtn").show();
  }
}

// 🎯 Filter gigs based on inputs and reset pagination
function applyFilters() {
  const venue = $("#venueFilter").val().toLowerCase();
  const date = $("#dateFilter").val();
  const genre = $("#genre-filter").val().toLowerCase();
  const search = $("#searchBoth").val().toLowerCase();

  filteredGigs = gigsData.filter(gig => {
    const matchVenue = !venue || gig.venue === venue;
    const matchDate = !date || gig.date === date;
    const matchGenre = !genre || gig.genre === genre;
    const matchSearch =
      !search ||
      gig.artist.toLowerCase().includes(search) ||
      formatVenueName(gig.venue).toLowerCase().includes(search);

    return matchVenue && matchDate && matchGenre && matchSearch;
  });

  displayGigsPaginated(filteredGigs, currentIndex, gigsPerPage);
}

// 🌟 Dynamic featured gigs carousel (unchanged)
function renderFeaturedCarousel(data) {
  const featuredGigs = data.filter(gig => gig.featured);
  const carousel = $(".hero-carousel");
  carousel.empty(); // Clear existing

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
          <button type="button">View Event</button>
        </div>
      </div>
    `;
    carousel.append(slide);
  });

  rotateSlides(); // Optional auto-rotation
}

// 🔁 Carousel auto-rotation every 5s (unchanged)
function rotateSlides() {
  let currentIndex = 0;
  const slides = $(".hero-carousel .slide");

  if (slides.length <= 1) return;

  setInterval(() => {
    slides.eq(currentIndex).removeClass("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides.eq(currentIndex).addClass("active");
  }, 5000);
}

// 🎭 Format venue key to readable name (unchanged)
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

// ✨ Capitalize strings (e.g., genre) (unchanged)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
