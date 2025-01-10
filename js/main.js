(function () {
  "use strict";

  // iPad and iPod detection
  var isiPad = function () {
    return navigator.platform.indexOf("iPad") != -1;
  };

  var isiPhone = function () {
    return (
      navigator.platform.indexOf("iPhone") != -1 ||
      navigator.platform.indexOf("iPod") != -1
    );
  };

  $("#submitBtn").on("click", function () {
    // Get all input values
    const name = $("#name-field").val();
    const email = $("#email-field").val();
    const phone = $("#phone-field").val();
    const dateStart = $("#date-start").val();
    const dateEnd = $("#date-end").val();
    const tripPreference = $("#trip-preference").val();
    const packagePreference = $("#package-preference").val();
    const adults = $("#adults").val();
    const children = $("#children").val();

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !dateStart ||
      !dateEnd ||
      !tripPreference ||
      !packagePreference ||
      !adults ||
      !children
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Email content for the admin
    const adminEmail = {
      to: [{ email: "support@sikkimexplorer.com", name: "Sikkim Explorer" }], // Replace with admin email
      subject: "New Trip Inquiry",
      htmlContent: `
			<p>You have received a new trip inquiry:</p>
			<ul>
			  <li><strong>Name:</strong> ${name}</li>
			  <li><strong>Email:</strong> ${email}</li>
			  <li><strong>Phone:</strong> ${phone}</li>
			  <li><strong>Trip Start Date:</strong> ${dateStart}</li>
			  <li><strong>Trip End Date:</strong> ${dateEnd}</li>
			  <li><strong>Trip Preference:</strong> ${tripPreference}</li>
			  <li><strong>Package Preference:</strong> ${packagePreference}</li>
			  <li><strong>Adults:</strong> ${adults}</li>
			  <li><strong>Children:</strong> ${children}</li>
			</ul>
		  `,
    };

    // Email content for the user
    const userEmail = {
      to: [{ email: email, name: name }],
      subject: "Thank you for your inquiry!",
      htmlContent: `
			<p>Hi ${name},</p>
			<p>Thank you for reaching out! We have received your inquiry and will get back to you soon.</p>
			<p>Here are the details you provided:</p>
			<ul>
			  <li><strong>Phone:</strong> ${phone}</li>
			  <li><strong>Trip Start Date:</strong> ${dateStart}</li>
			  <li><strong>Trip End Date:</strong> ${dateEnd}</li>
			  <li><strong>Trip Preference:</strong> ${tripPreference}</li>
			  <li><strong>Package Preference:</strong> ${packagePreference}</li>
			  <li><strong>Adults:</strong> ${adults}</li>
			  <li><strong>Children:</strong> ${children}</li>
			</ul>
			<p>Best regards,<br>Sikkim Explorer</p>
		  `,
    };

    // Send emails using Brevo API
    sendEmail(adminEmail);
    sendEmail(userEmail);

    alert("Thank you for your submission! We will contact you shortly.");
  });

  function sendEmail(emailData) {
	
    const apiKey = CONFIG.BREVO_API_KEY;

    const url = "https://api.brevo.com/v3/smtp/email";

    $.ajax({
      url: url,
      type: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      data: JSON.stringify({
        sender: {
          email: "support@sikkimexplorer.com",
          name: "Sikkim Explorer",
        }, // Replace with your sender email
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
      }),
      success: function (data) {
        console.log("Email sent successfully!");
      },
      error: function (error) {
        console.log("There was an error sending your email. Please try again.");
      },
    });
  }

  // Document on load.
  (function () {
    $("#date-start, #date-end").datepicker();
    [].slice
      .call(document.querySelectorAll("select.cs-select"))
      .forEach(function (el) {
        new SelectFx(el);
      });
    if (!isiPad() || !isiPhone()) {
      $(window).stellar();
    }
  })();
})();
