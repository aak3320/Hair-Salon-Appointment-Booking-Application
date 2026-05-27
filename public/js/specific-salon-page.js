// Handles fetching and displaying specific salon details

document.addEventListener('DOMContentLoaded', async () => {

    // Get salon name and suburb from URL
    const urlParams = new URLSearchParams(window.location.search);
    const salonName = urlParams.get('name');
    const salonSuburb = urlParams.get('suburb');

    // Elements
    const bufferingSpinner = document.getElementById('bufferingSpinner');
    const salonDetails = document.getElementById('salonDetails');
    const salonError = document.getElementById('salonError');

    // If no salon name in URL then back to catalog
    if (!salonName || !salonSuburb) {
        window.location.href = 'catalog.html';
        return;
    }

    try {

        const salonID = urlParams.get('salonID');

        if (salonID) {
            const response = await fetch(`/api/salons/${salonID}`);
            const salon = await response.json();

            if (!salon || salon.message) {

                // Salon not found
                bufferingSpinner.style.display = 'none';
                salonError.style.display = 'block';
                return;
            }

            // Found real salon from database
            displaySalonDetails(salon, salonSuburb || salonSuburb);
        }
        else {

            // Fetch salons from API
            const response = await fetch(`/api/salons?suburb=${encodeURIComponent(salonSuburb)}`);

            const salons = await response.json();

            // Find specific salon by name
            const salon = salons.find(
                s => s.name.toLowerCase().includes(salonName.toLowerCase()) ||
                    salonName.toLowerCase().includes(s.name.toLowerCase())
            );

            if (salon) {
                // Found a real Yelp match
                displaySalonDetails(salon, salonSuburb);
            }
            else {
                // Fallback to salon object from URL params
                const fallbackSalon = {
                    name: salonName,
                    address: urlParams.get('address') || 'Address not available',
                    ratings: urlParams.get('rating') || 'N/A',
                    price: urlParams.get('price') || 'N/A',
                    photos: [urlParams.get('image') || ''],
                    services: [],
                    prices: []
                };

                // Display Salon Details
                displaySalonDetails(fallbackSalon, salonSuburb);
            }
        }

    } catch (err) {
        // Show error if API fails
        bufferingSpinner.style.display = 'none';
        salonError.style.display = 'block';
        console.error('Error fetching salon:', err);
    }

});

let selectedServices = [];

// Display Salon Details Function
const displaySalonDetails = (salon, suburb) => {

    // Hide spinner
    bufferingSpinner.style.display = 'none';
    document.getElementById('salonDetails').style.display = 'block';

    // Basic Info
    document.getElementById('salonName').textContent = salon.name;
    document.getElementById('salonNameBook').textContent = salon.name;
    document.getElementById('salonAddress').textContent = salon.address || 'Address not available';
    document.getElementById('salonSuburb').textContent = suburb;
    document.getElementById('salonRating').textContent = salon.ratings || 'N/A';
    document.getElementById('salonRatingInfo').textContent = salon.ratings || 'N/A';
    document.getElementById('salonPrice').textContent = salon.price || 'N/A';
    document.getElementById('salonPriceInfo').textContent = salon.price || 'N/A';
    document.getElementById('salonSuburbInfo').textContent = suburb;

    // Salon Image
    const salonImage = document.getElementById('salonImage');
    if (salon.photos && salon.photos.length > 0 && salon.photos[0] !== '') {
        salonImage.src = salon.photos[0];
        salonImage.alt = salon.name;
    } else {
        // Default placeholder if no image
        salonImage.src = 'images/salon-placeholder.jpg';
        salonImage.alt = salon.name;
    }

    // Google Maps
    const mapsBtn = document.getElementById('mapsBtn');
    const mapsQuery = encodeURIComponent(`${salon.name} ${salon.address}`);
    mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    // Services List
    const servicesList = document.getElementById('servicesList');

    let servicesToShow = [];

    if (salon.services && salon.services.length > 0) {
        for (let i = 0; i < salon.services.length; i++) {

            // Check if price exists for this service
            let price = 'Contact for price';
            if (salon.prices && salon.prices[i]) {
                price = `$${salon.prices[i]}`;
            }

            // Add to services array
            servicesToShow.push({
                name: salon.services[i],
                price: price
            });
        }
    }
    else {
        // Default services if none in database
        servicesToShow = [
            { name: 'Haircut', price: 'Contact for price' },
            { name: 'Hair Colouring', price: 'Contact for price' },
            { name: 'Hair Treatment', price: 'Contact for price' },
            { name: 'Blow Dry', price: 'Contact for price' },
        ];
    }

    // Display services with Add/Remove button
    const renderServices = () => {

        servicesList.innerHTML = '';

        for (let i = 0; i < servicesToShow.length; i++) {

            const service = servicesToShow[i];

            // Check if this service is already selected
            const isSelected = selectedServices.includes(service.name);

            // Set ADD or REMOVE button text and class based on selection
            const btnText = isSelected ? 'Remove' : 'Add';
            const btnClass = isSelected ? 'service-add-btn service-added' : 'service-add-btn';

            // Build service item HTML
            const serviceHTML = `
                <div class="salon-service-item">
                    <div class="row valign-wrapper service-row">
                        <div class="col s8">
                            <span class="salon-service-name">${service.name}</span>
                            <br>
                            <span class="salon-service-price">${service.price}</span>
                        </div>
                        <div class="col s4 right-align">
                            <button
                                class="${btnClass}"
                                onclick="toggleService('${service.name}')">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                    <div class="divider salon-divider"></div>
                </div>
            `;

            servicesList.innerHTML += serviceHTML;
        }
    };

    // Render summary of selected services
    const renderSummary = () => {

        const summarySection = document.getElementById('servicesSummary');

        // Hide summary if no services selected
        if (selectedServices.length === 0) {
            summarySection.style.display = 'none';
            return;
        }


        summarySection.style.display = 'block';

        // Build summary items in HTML
        let summaryItemsHTML = '';

        for (let i = 0; i < selectedServices.length; i++) {

            const selectedName = selectedServices[i];

            // Find price for this service
            let selectedPrice = 'Contact for price';
            for (let j = 0; j < servicesToShow.length; j++) {
                if (servicesToShow[j].name === selectedName) {
                    selectedPrice = servicesToShow[j].price;
                }
            }

            summaryItemsHTML += `
                <div class="summary-item">
                    <span class="summary-item-name">
                        <i class="material-icons tiny">fiber_manual_record</i>
                        ${selectedName}
                    </span>
                    <span class="summary-item-price">
                        ${selectedPrice}
                    </span>
                </div>
            `;
        }

        // Update summary section HTML
        summarySection.innerHTML = `
            <div class="services-summary-content">
                <h6 class="services-summary-title">
                    <i class="material-icons tiny">check_circle</i>
                    Selected Services (${selectedServices.length})
                </h6>
                <div class="divider salon-divider"></div>
                ${summaryItemsHTML}
            </div>
        `;

    };

    // Toggle service selcetion button
    window.toggleService = (serviceName) => {

        // Check if service is already selected
        const index = selectedServices.indexOf(serviceName);

        if (index !== -1) {
            selectedServices.splice(index, 1);
        }
        else {
            // Add service to selected list
            selectedServices.push(serviceName);
        }

        // Re-rendering
        renderServices();
        renderSummary();

    };

    renderServices();

    const bookBtn = document.getElementById('bookBtn');

    bookBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            //Redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // Check if at least one service is selected
        if (selectedServices.length === 0) {

            // Show error message
            const errorBox = document.getElementById('serviceError');
            errorBox.style.display = 'block';
            errorBox.textContent = 'Please select at least one service before booking.';

            // Hide error after 3 seconds
            setTimeout(() => {
                errorBox.style.display = 'none';
            }, 3000);

            return;
        }

        // Pass salon details and selected services to appointment booking page via URL params
        const params = new URLSearchParams({
            name: salon.name,
            suburb: suburb,
            services: selectedServices.join(',')
        });

        if (salon._id) {
            params.append('salonID', salon._id);
        }

        window.location.href = `booking.html?${params.toString()}`;

    });

    // Reviews List
   // Reviews List
const reviewsList = document.getElementById('reviewsList');

async function loadSalonReviews(salonName) {
    try {
        const response = await fetch(`/reviews?salonName=${encodeURIComponent(salonName)}`);
        const reviews = await response.json();

        if (!reviews || reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="center-align salon-no-reviews">
                    <i class="material-icons salon-no-reviews-icon">rate_review</i>
                    <p>No reviews yet.</p>
                    <p class="grey-text">
                        Reviews will be available after completing an appointment.
                    </p>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = reviews.map((review) => `
            <div class="review-item">
                <p class="review-rating">⭐ ${review.rating}/5</p>
                <p>${review.comment}</p>
                <div class="divider salon-divider"></div>
            </div>
        `).join("");

    } catch (error) {
        reviewsList.innerHTML = `
            <p class="red-text center-align">Unable to load reviews.</p>
        `;
    }
}

loadSalonReviews(salon.name);

};
