// GreenRoots Volunteer Registration

const volunteerForm = document.getElementById("volunteerForm");

const successMessage = document.getElementById("successMessage");

volunteerForm.addEventListener("submit", function(event) {

    // Stop page refresh
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const interest = document.getElementById("interest").value;
    const availability = document.getElementById("availability").value;
    const message = document.getElementById("message").value.trim();

    // Check mobile number
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Create volunteer object
    const volunteer = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        location: location,
        interest: interest,
        availability: availability,
        message: message,
        registrationDate: new Date().toLocaleDateString()
    };

    // Get existing registrations
    let volunteers = JSON.parse(
        localStorage.getItem("greenRootsVolunteers") || "[]"
    );

    // Save new volunteer
    volunteers.push(volunteer);

    localStorage.setItem(
        "greenRootsVolunteers",
        JSON.stringify(volunteers)
    );

    // Show success message
    successMessage.textContent =
        "Thank you " + name +
        "! Your volunteer registration has been saved successfully.";

    // Reset form
    volunteerForm.reset();

});