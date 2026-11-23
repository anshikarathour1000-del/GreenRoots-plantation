// Contact Form

document.getElementById("contactForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const phone = document.getElementById("contactPhone").value.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10 digit mobile number.");
        return;
    }

    const contact = {
        id: Date.now().toString(),
        name: document.getElementById("contactName").value.trim(),
        email: document.getElementById("contactEmail").value.trim(),
        phone: phone,
        subject: document.getElementById("contactSubject").value.trim(),
        message: document.getElementById("contactMessage").value.trim(),
        date: new Date().toLocaleString("en-IN")
    };

    const contacts = JSON.parse(
        localStorage.getItem("greenrootsContacts") || "[]"
    );

    contacts.push(contact);

    localStorage.setItem(
        "greenrootsContacts",
        JSON.stringify(contacts)
    );

    document.getElementById("contactStatus").textContent =
        "Thank you! Your message has been submitted.";

    this.reset();
});


// Feedback Form

document.getElementById("feedbackForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const feedback = {
        id: Date.now().toString(),
        name: document.getElementById("feedbackName").value.trim(),
        email: document.getElementById("feedbackEmail").value.trim(),
        rating: document.getElementById("feedbackRating").value,
        message: document.getElementById("feedbackMessage").value.trim(),
        date: new Date().toLocaleString("en-IN")
    };

    const feedbacks = JSON.parse(
        localStorage.getItem("greenrootsFeedback") || "[]"
    );

    feedbacks.push(feedback);

    localStorage.setItem(
        "greenrootsFeedback",
        JSON.stringify(feedbacks)
    );

    document.getElementById("feedbackStatus").textContent =
        "Thank you for sharing your feedback!";

    this.reset();
});