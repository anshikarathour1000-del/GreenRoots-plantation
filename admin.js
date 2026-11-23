// =====================================
// GREENROOTS ADMIN DASHBOARD
// =====================================

// LocalStorage Keys
const VOLUNTEER_KEY = "greenRootsVolunteers";
const TREE_KEY = "greenRootsTrees";
const CAMPAIGN_KEY = "greenRootsCampaigns";
const DONATION_KEY = "greenRootsDonations";

// Get LocalStorage Data
function getData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Data error:", error);
        return [];
    }
}

// Save Data
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Prevent HTML injection
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Generate Unique ID
function generateId() {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();
}

// Date Formatting
function formatDate(date) {
    if (!date) return "-";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
        return escapeHTML(date);
    }

    return parsed.toLocaleDateString("en-IN");
}

// Empty Table
function emptyRow(columns, message) {
    return `<tr>
        <td colspan="${columns}" class="empty">
            ${message}
        </td>
    </tr>`;
}


// =====================================
// 1. SIDEBAR NAVIGATION
// =====================================

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".content-section");

navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const target = this.dataset.section;

        navLinks.forEach(item =>
            item.classList.remove("active")
        );

        sections.forEach(section =>
            section.classList.remove("active")
        );

        this.classList.add("active");

        document.getElementById(target).classList.add("active");

    });

});


// =====================================
// 2. DASHBOARD OVERVIEW
// =====================================

function updateDashboard() {

    const volunteers = getData(VOLUNTEER_KEY);
    const trees = getData(TREE_KEY);
    const campaigns = getData(CAMPAIGN_KEY);
    const donations = getData(DONATION_KEY);

    document.getElementById("totalTrees").textContent =
        trees.length;

    document.getElementById("totalVolunteers").textContent =
        volunteers.length;

    document.getElementById("totalCampaigns").textContent =
        campaigns.length;

    const totalAmount = donations.reduce((total, donation) => {

        const amount = Number(donation.amount);

        return total + (
            Number.isFinite(amount) && amount > 0
                ? amount
                : 0
        );

    }, 0);

    document.getElementById("totalDonations").textContent =
        "₹" + totalAmount.toLocaleString("en-IN");

    // Recent Volunteers

    const recent = [...volunteers].reverse().slice(0, 5);

    const recentTable =
        document.getElementById("recentVolunteers");

    recentTable.innerHTML = recent.length
        ? recent.map(volunteer => `
            <tr>
                <td>${escapeHTML(volunteer.name)}</td>
                <td>${escapeHTML(volunteer.email)}</td>
                <td>${escapeHTML(volunteer.location)}</td>
                <td>${escapeHTML(volunteer.registrationDate)}</td>
            </tr>
        `).join("")
        : emptyRow(4, "No volunteers registered yet");
}

// =====================================
// 3. MANAGE VOLUNTEERS
// =====================================

function displayVolunteers(search = "") {

    const volunteers = getData(VOLUNTEER_KEY);

    const filtered = volunteers.filter(volunteer => {

        const name = String(volunteer.name || "").toLowerCase();
        const email = String(volunteer.email || "").toLowerCase();

        return name.includes(search.toLowerCase()) ||
               email.includes(search.toLowerCase());

    });

    const table = document.getElementById("volunteerTable");

    if (filtered.length === 0) {

        table.innerHTML = emptyRow(7, "No volunteers found");

        return;
    }

    table.innerHTML = filtered.map(volunteer => `
        <tr>
            <td>${escapeHTML(volunteer.name)}</td>
            <td>${escapeHTML(volunteer.email)}</td>
            <td>${escapeHTML(volunteer.phone)}</td>
            <td>${escapeHTML(volunteer.location)}</td>
            <td>${escapeHTML(volunteer.interest)}</td>
            <td>${escapeHTML(volunteer.availability)}</td>

            <td>
                <button class="delete-btn"
                    data-delete-volunteer="${escapeHTML(volunteer.id)}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// Volunteer Search

document.getElementById("searchVolunteer")
.addEventListener("input", function() {

    displayVolunteers(this.value);

});


// Delete Volunteer

document.getElementById("volunteerTable")
.addEventListener("click", function(event) {

    const button = event.target.closest(
        "[data-delete-volunteer]"
    );

    if (!button) return;

    if (!confirm("Delete this volunteer?")) return;

    const id = button.dataset.deleteVolunteer;

    const volunteers = getData(VOLUNTEER_KEY);

    const updated = volunteers.filter(
        volunteer => String(volunteer.id) !== id
    );

    saveData(VOLUNTEER_KEY, updated);

    displayVolunteers(
        document.getElementById("searchVolunteer").value
    );

    updateDashboard();

    alert("Volunteer deleted successfully!");

});

// =====================================
// 4. MANAGE TREES
// =====================================

function displayTrees() {

    const trees = getData(TREE_KEY);

    const table = document.getElementById("treeTable");

    if (trees.length === 0) {

        table.innerHTML = emptyRow(4, "No trees added yet");

        return;
    }

    table.innerHTML = trees.map(tree => `
        <tr>
            <td>${escapeHTML(tree.name)}</td>
            <td>${escapeHTML(tree.location)}</td>
            <td>${formatDate(tree.date)}</td>

            <td>
                <button class="delete-btn"
                    data-delete-tree="${escapeHTML(tree.id)}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// Add New Tree

document.getElementById("treeForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const tree = {
        id: generateId(),

        name: document.getElementById("treeName").value.trim(),

        location: document.getElementById("treeLocation").value.trim(),

        date: document.getElementById("treeDate").value
    };

    if (!tree.name || !tree.location || !tree.date) {
        alert("Please fill all details!");
        return;
    }

    const trees = getData(TREE_KEY);

    trees.push(tree);

    saveData(TREE_KEY, trees);

    this.reset();

    displayTrees();

    updateDashboard();

    alert("Tree added successfully!");

});


// Delete Tree

document.getElementById("treeTable")
.addEventListener("click", function(event) {

    const button = event.target.closest("[data-delete-tree]");

    if (!button) return;

    if (!confirm("Delete this tree?")) return;

    const id = button.dataset.deleteTree;

    const trees = getData(TREE_KEY).filter(
        tree => String(tree.id) !== id
    );

    saveData(TREE_KEY, trees);

    displayTrees();

    updateDashboard();

    alert("Tree deleted successfully!");

});

// =====================================
// 5. MANAGE CAMPAIGNS
// =====================================

function displayCampaigns() {

    const campaigns = getData(CAMPAIGN_KEY);

    const table = document.getElementById("campaignTable");

    if (campaigns.length === 0) {

        table.innerHTML = emptyRow(4, "No campaigns created yet");

        return;
    }

    table.innerHTML = campaigns.map(campaign => `
        <tr>
            <td>${escapeHTML(campaign.name)}</td>
            <td>${escapeHTML(campaign.location)}</td>
            <td>${formatDate(campaign.date)}</td>

            <td>
                <button class="delete-btn"
                    data-delete-campaign="${escapeHTML(campaign.id)}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// Create Campaign

document.getElementById("campaignForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const campaign = {

        id: generateId(),

        name: document.getElementById("campaignName").value.trim(),

        location: document.getElementById("campaignLocation").value.trim(),

        date: document.getElementById("campaignDate").value

    };

    if (!campaign.name || !campaign.location || !campaign.date) {
        alert("Please fill all campaign details!");
        return;
    }

    const campaigns = getData(CAMPAIGN_KEY);

    campaigns.push(campaign);

    saveData(CAMPAIGN_KEY, campaigns);

    this.reset();

    displayCampaigns();

    updateDashboard();

    alert("Campaign created successfully!");

});


// Delete Campaign

document.getElementById("campaignTable")
.addEventListener("click", function(event) {

    const button = event.target.closest(
        "[data-delete-campaign]"
    );

    if (!button) return;

    if (!confirm("Delete this campaign?")) return;

    const id = button.dataset.deleteCampaign;

    const campaigns = getData(CAMPAIGN_KEY).filter(
        campaign => String(campaign.id) !== id
    );

    saveData(CAMPAIGN_KEY, campaigns);

    displayCampaigns();

    updateDashboard();

    alert("Campaign deleted successfully!");

});


// =====================================
// 6. MANAGE DONATIONS
// =====================================

function displayDonations() {

    const donations = getData(DONATION_KEY);

    const table = document.getElementById("donationTable");

    if (donations.length === 0) {

        table.innerHTML = emptyRow(4, "No donation records available");

        return;
    }

    table.innerHTML = donations.map(donation => {

        const amount = Number(donation.amount);

        return `
            <tr>
                <td>${escapeHTML(donation.name)}</td>
                <td>${escapeHTML(donation.email)}</td>
                <td>₹${Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "0"}</td>
                <td>${formatDate(donation.date)}</td>
            </tr>
        `;

    }).join("");
}

// =====================================
// 7. INITIALIZE DASHBOARD
// =====================================

function initializeDashboard() {

    updateDashboard();

    displayVolunteers();

    displayTrees();

    displayCampaigns();

    displayDonations();

}

// Start Dashboard

initializeDashboard();


// Refresh when another page changes LocalStorage
window.addEventListener("storage", function(event) {

    if (
        event.key === VOLUNTEER_KEY ||
        event.key === TREE_KEY ||
        event.key === CAMPAIGN_KEY ||
        event.key === DONATION_KEY
    ) {
        initializeDashboard();
    }

});

function loadDonations() {

    const donations = JSON.parse(
        localStorage.getItem("greenrootsDonations") || "[]"
    );

    const tableBody = document.getElementById("donationTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (donations.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No donation records available</td>
            </tr>
        `;
        return;
    }

    donations.forEach(donation => {

        const row = document.createElement("tr");

        [donation.name, donation.email,
         "₹" + donation.amount, donation.date].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", loadDonations);

function loadFeedback() {

    const feedbacks = JSON.parse(
        localStorage.getItem("greenrootsFeedback") || "[]"
    );

    const table = document.getElementById("feedbackTableBody");

    if (!table) return;

    table.innerHTML = "";

    if (feedbacks.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">No feedback received yet.</td>
            </tr>
        `;
        return;
    }

    feedbacks.forEach(item => {

        const row = document.createElement("tr");

        const values = [
            item.name,
            item.email,
            "⭐".repeat(Number(item.rating)),
            item.message,
            item.date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", loadFeedback);
