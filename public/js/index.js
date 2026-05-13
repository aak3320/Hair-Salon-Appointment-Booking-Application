const searchBar = document.getElementById("searchBar");
  const filterSelect = document.getElementById("filterSelect");
  const salonContainer = document.getElementById("salonContainer");

  async function loadSalons() {
    const suburb = filterSelect.value;
    const searchValue = searchBar.value.toLowerCase();

    try {
      const response = await fetch(`/salons?suburb=${encodeURIComponent(suburb)}`);
      let salons = await response.json();

      if (searchValue !== "") {
        salons = salons.filter((salon) =>
          salon.name.toLowerCase().includes(searchValue)
        );
      }

      displaySalons(salons);
    } catch (error) {
      salonContainer.innerHTML = "<p>Unable to load salons.</p>";
    }
  }

  function displaySalons(salons) {
    salonContainer.innerHTML = "";

    if (salons.length === 0) {
      salonContainer.innerHTML = "<p>No salons found for this suburb.</p>";
      return;
    }

    salons.forEach((salon) => {
      const card = document.createElement("div");
      card.className = "catalog-card";

      card.innerHTML = `
        <img src="${salon.photos[0] || 'images/salon1.png'}" alt="Salon">

        <div class="catalog-content">
          <h3>${salon.name}</h3>
          <p>${salon.suburb}</p>
          <p>${salon.address}</p>
          <p class="rating">⭐ ${salon.ratings} Rating</p>
          <a href="${salon.url}" target="_blank">
            <button class="btn-primary">View Salon</button>
          </a>
        </div>
      `;

      salonContainer.appendChild(card);
    });
  }

  filterSelect.addEventListener("change", loadSalons);
  searchBar.addEventListener("input", loadSalons);

  loadSalons();