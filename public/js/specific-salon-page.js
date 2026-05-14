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

    } catch (err) {
        // Show error if API fails
        bufferingSpinner.style.display = 'none';
        salonError.style.display = 'block';
        console.error('Error fetching salon:', err);
    }

});

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

    if (salon.services && salon.services.length > 0) {
        // Show services from database
        servicesList.innerHTML = salon.services.map((service, index) => `
            <div class="salon-service-item">
                <div class="row valign-wrapper" style="margin-bottom: 0;">
                    <div class="col s8">
                        <i class="material-icons tiny salon-service-icon">fiber_manual_record</i>
                        <span class="salon-service-name">${service}</span>
                    </div>
                    <div class="col s4 right-align">
                        <span class="salon-service-price">
                            ${salon.prices && salon.prices[index]
                ? `$${salon.prices[index]}`
                : 'Contact for price'
            }
                        </span>
                    </div>
                </div>
                <div class="divider salon-divider"></div>
            </div>
        `).join('');
    } else {
        // Default services if none in database
        const defaultServices = [
            { name: 'Haircut', price: 'Contact for price' },
            { name: 'Hair Colouring', price: 'Contact for price' },
            { name: 'Hair Treatment', price: 'Contact for price' },
            { name: 'Blow Dry', price: 'Contact for price' },
        ];

        servicesList.innerHTML = defaultServices.map(service => `
            <div class="salon-service-item">
                <div class="row valign-wrapper" style="margin-bottom: 0;">
                    <div class="col s8">
                        <i class="material-icons tiny salon-service-icon">fiber_manual_record</i>
                        <span class="salon-service-name">${service.name}</span>
                    </div>
                    <div class="col s4 right-align">
                        <span class="salon-service-price">${service.price}</span>
                    </div>
                </div>
                <div class="divider salon-divider"></div>
            </div>
        `).join('');
    }

    // Reviews List
    const reviewsList = document.getElementById('reviewsList');

    // Review from database
    reviewsList.innerHTML = `
        <div class="center-align salon-no-reviews">
            <i class="material-icons salon-no-reviews-icon">rate_review</i>
            <p>No reviews yet.</p>
            <p class="grey-text">
                Reviews will be available after completing an appointment.
            </p>
        </div>
    `;

};