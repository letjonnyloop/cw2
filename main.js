$(document).ready(function () {
    $(".intro").hide().fadeIn(1500);
    $("#dateFilter").datepicker({ dateFormat: "dd/mm/yy" });

    // Venue display name mapping
    const venueNames = {
        customhouse: "Custom House Square",
        empire: "Empire Music Hall",
        limelight: "LimeLight",
        mandela: "Mandela Hall",
        ohyeah: "Oh Yeah Music Centre",
        voodoo: "Voodoo"
    };

    let gigs = [];

    // Fetch gigs from gigs.json
    $.getJSON("gigs.json", function (data) {
        gigs = data;

        // Initial render
        renderGigs();
    });

    function renderGigs(filterVenue = "all", filterDate = "") {
        const filtered = gigs.filter(gig => {
            const venueMatch = filterVenue === "all" || gig.venue === filterVenue;
            const dateMatch = !filterDate || gig.date === filterDate;
            return venueMatch && dateMatch;
        });

        const html = filtered.length
            ? filtered.map(gig => {
                const displayVenue = venueNames[gig.venue] || gig.venue;
                return `<p><strong>${gig.artist}</strong> @ ${displayVenue} on ${gig.date}</p>`;
            }).join("")
            : "<p>No gigs found.</p>";

        $("#gigList").html(html);
    }

    // Filter listener
    $("#venueFilter, #dateFilter").on("change", () => {
        renderGigs($("#venueFilter").val(), $("#dateFilter").val());
    });
});
