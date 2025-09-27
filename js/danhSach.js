(function () {
  const roomList = document.getElementById("roomList");
  const searchInput = document.getElementById("searchInput");
  const filterType = document.getElementById("filterType");
  const filterPrice = document.getElementById("filterPrice");
  const sortSelect = document.getElementById("sortSelect");
  const emptyState = document.getElementById("emptyState");

  let currentRooms = getRooms();

  function renderRooms(rooms) {
    roomList.innerHTML = "";

    if (rooms.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      return;
    } else {
      if (emptyState) emptyState.style.display = "none";
    }

    rooms.forEach((room) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${room.images[0]}" class="card-img-top" alt="${
        room.name
      }" onerror="this.src='images/default.jpg'">
          <div class="card-body">
            <h5 class="card-title">${room.name}</h5>
            <p class="card-text">${room.description}</p>
            <p><strong>Giá:</strong> ${room.price.toLocaleString()} đ</p>
            <p><strong>Đánh giá:</strong> ${room.rating ?? "Chưa có"} ⭐</p>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#roomModal" data-id="${
              room.id
            }">
              Xem chi tiết
            </button>
          </div>
        </div>
      `;
      roomList.appendChild(col);
    });
  }

  function applyFilters() {
    let rooms = getRooms();

    const type = filterType.value;
    if (type) rooms = rooms.filter((r) => r.type === type);

    const priceFilter = filterPrice.value;
    if (priceFilter === "duoi2") rooms = rooms.filter((r) => r.price < 2000000);
    else if (priceFilter === "2-5")
      rooms = rooms.filter((r) => r.price >= 2000000 && r.price <= 5000000);
    else if (priceFilter === "tren5")
      rooms = rooms.filter((r) => r.price > 5000000);

    const keyword = searchInput.value.toLowerCase();
    if (keyword) {
      rooms = rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword) ||
          r.description.toLowerCase().includes(keyword)
      );
    }

    const sort = sortSelect.value;
    if (sort === "gia-tang") rooms.sort((a, b) => a.price - b.price);
    else if (sort === "gia-giam") rooms.sort((a, b) => b.price - a.price);
    else if (sort === "ten") rooms.sort((a, b) => a.name.localeCompare(b.name));

    currentRooms = rooms;
    renderRooms(currentRooms);
  }

  searchInput.addEventListener("input", applyFilters);
  filterType.addEventListener("change", applyFilters);
  filterPrice.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  renderRooms(currentRooms);

  const roomModal = document.getElementById("roomModal");
  roomModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute("data-id");
    const room = getRooms().find((r) => r.id == id);
    if (!room) return;

    document.getElementById("modalTitle").innerText = room.name;
    document.getElementById("modalDescription").innerText = room.description;
    document.getElementById("modalPrice").innerText =
      room.price.toLocaleString() + " đ";
    document.getElementById("modalAddress").innerText = room.address;

    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";
    room.images.forEach((img, index) => {
      const div = document.createElement("div");
      div.className = "carousel-item" + (index === 0 ? " active" : "");
      div.innerHTML = `<img src="${img}" class="d-block w-100" alt="${room.name}">`;
      carouselInner.appendChild(div);
    });

    document.querySelector(".carousel-control-prev").style.display =
      room.images.length > 1 ? "block" : "none";
    document.querySelector(".carousel-control-next").style.display =
      room.images.length > 1 ? "block" : "none";
  });
})();
