document.addEventListener("DOMContentLoaded", function () {
  const roomListEl = document.getElementById("roomList");
  if (!roomListEl) return;

  const searchInput = document.getElementById("searchInput");
  const filterType = document.getElementById("filterType");
  const filterPrice = document.getElementById("filterPrice");
  const sortSelect = document.getElementById("sortSelect");
  const paginationEl = document.getElementById("pagination");
  const activeFiltersEl = document.getElementById("activeFilters");
  const modalElement = document.getElementById("roomModal");
  const modal = new bootstrap.Modal(modalElement);

  let currentPage = 1;
  const itemsPerPage = 6;

  // Gắn sự kiện
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderRooms();
  });
  filterType.addEventListener("change", () => {
    currentPage = 1;
    renderRooms();
  });
  filterPrice.addEventListener("change", () => {
    currentPage = 1;
    renderRooms();
  });
  sortSelect.addEventListener("change", () => renderRooms());

  renderRooms();

  function renderRooms() {
    const rooms = getRooms();
    let filtered = rooms.filter((r) => {
      const q = searchInput.value.trim().toLowerCase();
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (filterType.value && r.type !== filterType.value) return false;

      if (filterPrice.value === "duoi2" && r.price >= 2000000) return false;
      if (
        filterPrice.value === "2-5" &&
        (r.price < 2000000 || r.price > 5000000)
      )
        return false;
      if (filterPrice.value === "tren5" && r.price <= 5000000) return false;

      return true;
    });

    // Sắp xếp
    if (sortSelect.value === "gia-tang")
      filtered.sort((a, b) => a.price - b.price);
    if (sortSelect.value === "gia-giam")
      filtered.sort((a, b) => b.price - a.price);
    if (sortSelect.value === "ten")
      filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Phân trang
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    // Render card
    roomListEl.innerHTML = paginated
      .map(
        (r) => `
      <div class="col-md-4 mb-4">
        <div class="card position-relative">
          ${r.hot ? '<span class="badge bg-danger badge-hot">Hot</span>' : ""}
          <span class="favorite-btn ${
            isFavorite(r.id) ? "active" : ""
          }" data-id="${r.id}">❤</span>
          <img src="${r.images[0]}" class="card-img-top" alt="${r.name}">
          <div class="card-body">
            <h5 class="card-title">${r.name}</h5>
            <p class="card-text">${r.description}</p>
            <p class="text-success mb-1">${r.price.toLocaleString()} VND</p>
            <button class="btn btn-primary w-100" onclick="showRoom(${
              r.id
            })">Xem thêm</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    bindFavoriteEvents();
    renderPagination(totalPages);
    renderActiveFilters();
  }

  function renderPagination(total) {
    let html = "";
    for (let i = 1; i <= total; i++) {
      html += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
    }
    paginationEl.innerHTML = html;
    paginationEl.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = +link.dataset.page;
        renderRooms();
      });
    });
  }

  function isFavorite(id) {
    const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    return fav.includes(id);
  }

  function toggleFavorite(id) {
    let fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    fav = fav.includes(id) ? fav.filter((x) => x !== id) : [...fav, id];
    localStorage.setItem("favorites", JSON.stringify(fav));
    renderRooms();
  }

  function bindFavoriteEvents() {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(+btn.dataset.id);
      });
    });
  }

  function renderActiveFilters() {
    let tags = "";
    const q = searchInput.value.trim();
    const type = filterType.value;
    const price = filterPrice.value;

    if (q) tags += `<span class="badge bg-primary me-2">Từ khóa: ${q}</span>`;
    if (type)
      tags += `<span class="badge bg-success me-2">Loại: ${type}</span>`;
    if (price) {
      const txt =
        price === "duoi2" ? "Dưới 2M" : price === "2-5" ? "2-5M" : "Trên 5M";
      tags += `<span class="badge bg-warning text-dark me-2">${txt}</span>`;
    }
    activeFiltersEl.innerHTML = tags;
  }

  window.showRoom = function (id) {
    const r = getRooms().find((x) => x.id === id);
    if (!r) return;
    document.getElementById("modalTitle").textContent = r.name;
    document.getElementById("modalDescription").textContent = r.description;
    document.getElementById("modalPrice").textContent =
      r.price.toLocaleString() + " VND";
    document.getElementById("modalAddress").textContent = r.address;

    document.getElementById("carouselInner").innerHTML = r.images
      .map(
        (images, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${images}" class="d-block w-100" alt="">
      </div>
    `
      )
      .join("");

    document.getElementById("modalMap").innerHTML = `
      <iframe 
        src="https://www.google.com/maps?q=${encodeURIComponent(
          r.address
        )}&output=embed" 
        width="100%" height="100%" style="border:0;"></iframe>`;

    modal.show();
  };
});
