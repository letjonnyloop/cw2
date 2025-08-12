$(document).ready(function () {
  $(".month-checkbox").change(function () {
    updateSelectedMonths();
  });

  function updateSelectedMonths() {
    var selectedMonths = [];

    $(".month-checkbox:checked").each(function () {
      selectedMonths.push($(this).val());
    });

    $("#selectedMonths").empty();
    selectedMonths.forEach(function (month) {
      $("#selectedMonths").append(`
                <div class="selected-month" data-month="${month}">
                    ${month} <span class="remove-month">&times;</span>
                </div>
            `);
    });

    $(".remove-month").click(function () {
      var monthToRemove = $(this).parent().data("month");
      $(`#${monthToRemove.toLowerCase()}`).prop("checked", false);
      updateSelectedMonths();
    });
  }

  $("#joinForm").submit(function (event) {
    event.preventDefault();

    var firstName = $("#firstName").val();
    var surname = $("#surname").val();
    var email = $("#email").val();
    var availableMonths = [];

    $(".month-checkbox:checked").each(function () {
      availableMonths.push($(this).val());
    });

    if (!firstName || !surname || !email) {
      $("#formMessage")
        .html("Please fill in all required fields.")
        .css("color", "red");
      return;
    }

    if (availableMonths.length === 0) {
      $("#formMessage")
        .html("Please select at least one month you are available.")
        .css("color", "red");
      return;
    }

    $.ajax({
      url: "http://localhost:5000/send-email",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: firstName,
        surname: surname,
        email: email,
        availableMonths: availableMonths,
      }),
      success: function (response) {
        alert(
          "You're in! You will receive an email confirmation from us shortly."
        );
        $("#joinForm")[0].reset();
        $("#selectedMonths").empty();
      },
      error: function () {
        $("#formMessage")
          .html("Error sending email. Please try again.")
          .css("color", "red");
      },
    });
  });
});
