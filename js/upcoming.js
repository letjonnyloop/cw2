$(document).ready(function () {
    const $venueFilter = $('#venueFilter');
    const $dateFilter = $('#dateFilter');
    const $genreFilter = $('#genre-filter');
    const $searchBoth = $('#searchBoth');
    const $clearFilters = $('#clearFilters');
    const $gigsWrapper = $('.gig-list-wrapper');
    const $numberOfResults = $('#number-of-results');
    const $filterForm = $('#filter-form');

    let gigsData;

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

    function displayGigs(gigs) {
        $gigsWrapper.empty();
        $numberOfResults.text(`Showing (${gigs.length}) Gigs`);

        if (gigs.length === 0) {
            const noResultsHtml = `
                <div class="no-gigs">
                    <h2>No gigs found</h2>
                    <p>Try adjusting your filters or search terms.</p>
                </div>`;
            $gigsWrapper.append(noResultsHtml);
            return;
        }

        $.each(gigs, function (_, gig) {
            const gigHtml = `
                <div class="gig-container">
                    <div class="gig-wrapper">
                        <h4 class="act-name">${gig.artist}</h4>
                        <img alt="" class="gig-thumbnail" data-image-width="1631" data-image-height="1080" src="images/${gig.image}">
                        <div class="line-horizontal"></div>
                        <p class="gig-description">${gig.description}</p>
                        <div class="gig-date-time-venue">
                            📅 ${gig.date}<br>
                            🕒 ${gig.time}<br>
                            <span class="location-icon">📍</span>
                            <span class="location-text">${formatVenueName(gig.venue)}, ${gig.location}</span>
                        </div>
                    </div>
                </div>`;
            $gigsWrapper.append(gigHtml);
        });
    }

    function filterGigs() {
        const venue = $venueFilter.val();
        const date = $dateFilter.val().toString();
        const date_formatted = `${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}`
        const genre = $genreFilter.val();
        const searchBoth = $searchBoth.val().toLowerCase();

        let filteredGigs = gigsData;

        if (genre !== "") {
            filteredGigs = filteredGigs.filter(gig => gig.genre === genre);
        }

        if (date !== "") {
            
            filteredGigs = filteredGigs.filter(gig => gig.date.toString()===date_formatted);
        }

        if (venue !== "") {
            filteredGigs = filteredGigs.filter(gig => gig.venue === venue);
        }

        if (searchBoth !== "") {
            filteredGigs = filteredGigs.filter(gig =>
                gig.venue.toLowerCase().includes(searchBoth) ||
                gig.date.toLowerCase().includes(searchBoth) ||
                gig.artist.toLowerCase().includes(searchBoth)
            );
        }

        displayGigs(filteredGigs);
    }


    // Ensure that user can't select dates that are in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    $dateFilter.attr('min', `${yyyy}-${mm}-${dd}`);
    

    // Fetch data and display on load
    $.getJSON('data/gigs.json', function (data) {
        gigsData = data;
        displayGigs(gigsData);
    });

    // Bind events
    $genreFilter.add($venueFilter).add($dateFilter).add($searchBoth).on('change input', filterGigs);

    $clearFilters.on('click', function () {
        $filterForm[0].reset(); // reset() is still native
        displayGigs(gigsData);
    });
});
