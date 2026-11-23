const amountButtons = document.querySelectorAll(".amount-btn");
const amountInput = document.getElementById("donationAmount");

amountButtons.forEach(button => {
    button.addEventListener("click", () => {
        amountButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
        amountInput.value = button.dataset.amount;
    });
});

document.getElementById("donationForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("donorName").value.trim();
    const email = document.getElementById("donorEmail").value.trim();
    const phone = document.getElementById("donorPhone").value.trim();
    const amount = Number(amountInput.value);
    const message = document.getElementById("donorMessage").value.trim();

    if (!name || !email || !/^[0-9]{10}$/.test(phone) ||
        !Number.isSafeInteger(amount) || amount < 1) {
        alert("Please enter valid donation details.");
        return;
    }

    const donation = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        amount: amount,
        message: message,
        date: new Date().toLocaleDateString("en-IN"),
        status: "Pending Payment"
    };

    let donations = JSON.parse(
        localStorage.getItem("greenrootsDonations") || "[]"
    );

    donations.push(donation);

    localStorage.setItem(
        "greenrootsDonations",
        JSON.stringify(donations)
    );

    document.getElementById("successMessage").textContent =
        "Your donation details have been submitted successfully!";

    this.reset();

    amountButtons.forEach(btn => btn.classList.remove("active"));
});