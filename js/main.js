$(document).ready(function () {
    // Animate logo
    $("#logo").css({ position: "relative", left: "-200px", opacity: 0 })
        .animate({ left: "0", opacity: 1 }, 1000, "easeOutBounce", function () {
            $(".topnav").hide().fadeIn(800);
        });

    // Setup datepicker
    $("#dateFilter").datepicker({ dateFormat: "yy-mm-dd" });

    // Map venue keys to display names
    const venueNames = {
        customhouse: "Custom House Square",
        empire: "Empire Music Hall",
        limelight: "LimeLight",
        mandela: "Mandela Hall",
        ohyeah: "Oh Yeah Music Centre",
        voodoo: "Voodoo"
    };

    let gigs = [];

    // Load gigs JSON and initialize everything
    $.getJSON("data/gigs.json")
    .done(function(data) {
        gigs = data;
        console.log("Gigs loaded", gigs);
        populateCarousel();
        renderGigs();
        updateCarouselVisibility();
        startAutoRotate();
    })
    .fail(function(jqxhr, textStatus, error) {
        console.error("Failed to load gigs.json:", textStatus, error);
    });

    // Populate carousel with gigs data
    function populateCarousel() {
        const $track = $(".carousel-track");
        $track.empty();

        gigs.forEach((gig, index) => {
            const imgSrc = `images/${gig.image}`;
            const altText = `${gig.artist} performing at ${venueNames[gig.venue] || gig.venue}`;
            const slideClass = index === 0 ? "carousel-slide current-slide" : "carousel-slide";

            const slideHTML = `
                <li class="${slideClass}">
                    <img src="${imgSrc}" alt="${altText}">
                    <div class="gigOverlay">
                        ${gig.artist} — ${venueNames[gig.venue] || gig.venue} — ${gig.date}
                    </div>
                </li>
            `;

            $track.append(slideHTML);
        });
    }

    // Carousel state and controls
    let currentIndex = 0;
    const slideCount = () => $(".carousel-slide").length;
    let autoRotateInterval;

    function showSlide(index) {
        if (index >= slideCount()) index = 0;
        if (index < 0) index = slideCount() - 1;

        $(".carousel-slide").removeClass("current-slide");
        $(".carousel-slide").eq(index).addClass("current-slide");
        currentIndex = index;
    }

    // Auto-rotate carousel every 3.5 seconds
    function startAutoRotate() {
        clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 3500);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Show/hide carousel based on filters and control auto-rotate
    function updateCarouselVisibility() {
        const venueFilter = $("#venueFilter").val();
        const dateFilter = $("#dateFilter").val();
        const searchFilter = $("#searchBoth").val();

        clearInterval(autoRotateInterval);

        if (venueFilter !== "all" || dateFilter || searchFilter) {
            $("#carouselContainer").fadeOut();
        } else {
            $("#carouselContainer").fadeIn();
            startAutoRotate();
        }
    }

    // Render gigs list filtered by criteria
    function renderGigs(filterVenue = "all", filterDate = "", keyword = "") {
        const isFiltering = filterVenue !== "all" || filterDate || keyword;

        if (isFiltering) {
            $("#carouselContainer").fadeOut();
        } else {
            $("#carouselContainer").fadeIn();
        }

        const filtered = gigs.filter(gig => {
            const venueMatch = filterVenue === "all" || gig.venue === filterVenue;
            const dateMatch = !filterDate || gig.date.includes(filterDate);
            const keywordMatch = gig.artist.toLowerCase().includes(keyword.toLowerCase()) ||
                (venueNames[gig.venue] || gig.venue).toLowerCase().includes(keyword.toLowerCase());
            return venueMatch && dateMatch && keywordMatch;
        });

        const html = filtered.length
            ? filtered.map(gig => `
                <div class="gigCard">
                    <h3>${gig.artist}</h3>
                    <p>${venueNames[gig.venue] || gig.venue} — ${gig.date}</p>
                </div>
            `).join("")
            : "<p>No gigs found.</p>";

        $("#gigList").hide().html(html).fadeIn();
    }

    // Filter inputs handler - unified
    $("#venueFilter, #dateFilter, #searchBoth").on("input change", function () {
        const venue = $("#venueFilter").val();
        const date = $("#dateFilter").val();
        const keyword = $("#searchBoth").val();
        renderGigs(venue, date, keyword);
        updateCarouselVisibility();
    });

    // Clear filters button handler
    $("#clearFilters").on("click", function () {
        $("#venueFilter").val("all");
        $("#dateFilter").val("");
        $("#searchBoth").val("");
        renderGigs();
        updateCarouselVisibility();
    });
});
