(function () {
  const roomList = document.getElementById("roomList");
  const searchInput = document.getElementById("searchInput");
  const filterType = document.getElementById("filterType");
  const filterPrice = document.getElementById("filterPrice");
  const sortSelect = document.getElementById("sortSelect");

  let currentRooms = getRooms(); // lấy từ localStorage

  // Hàm render danh sách phòng
  function renderRooms(rooms) {
    roomList.innerHTML = "";

    if (rooms.length === 0) {
      roomList.innerHTML = `<p class="text-center text-muted">Không tìm thấy phòng nào.</p>`;
      return;
    }

    rooms.forEach((room) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${room.images[0]}" class="card-img-top" alt="${room.name}">
          <div class="card-body">
            <h5 class="card-title">${room.name}</h5>
            <p class="card-text">${room.description}</p>
            <p><strong>Giá:</strong> ${room.price.toLocaleString()} đ</p>
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

  // Hàm lọc theo giao diện
  function applyFilters() {
    let rooms = getRooms();

    // lọc theo loại phòng
    const type = filterType.value;
    if (type) {
      rooms = rooms.filter((r) => r.type === type);
    }

    // lọc theo giá
    const priceFilter = filterPrice.value;
    if (priceFilter === "duoi2") {
      rooms = rooms.filter((r) => r.price < 2000000);
    } else if (priceFilter === "2-5") {
      rooms = rooms.filter((r) => r.price >= 2000000 && r.price <= 5000000);
    } else if (priceFilter === "tren5") {
      rooms = rooms.filter((r) => r.price > 5000000);
    }

    // lọc theo search
    const keyword = searchInput.value.toLowerCase();
    if (keyword) {
      rooms = rooms.filter((r) => r.name.toLowerCase().includes(keyword));
    }

    // sắp xếp
    const sort = sortSelect.value;
    if (sort === "gia-tang") {
      rooms.sort((a, b) => a.price - b.price);
    } else if (sort === "gia-giam") {
      rooms.sort((a, b) => b.price - a.price);
    } else if (sort === "ten") {
      rooms.sort((a, b) => a.name.localeCompare(b.name));
    }

    currentRooms = rooms;
    renderRooms(currentRooms);
  }

  // Bắt sự kiện khi thay đổi filter
  searchInput.addEventListener("input", applyFilters);
  filterType.addEventListener("change", applyFilters);
  filterPrice.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  // Render ban đầu
  renderRooms(currentRooms);

  // Modal chi tiết
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

    // Carousel
    const carouselInner = document.getElementById("carouselInner");
    carouselInner.innerHTML = "";
    room.images.forEach((img, index) => {
      const div = document.createElement("div");
      div.className = "carousel-item" + (index === 0 ? " active" : "");
      div.innerHTML = `<img src="${img}" class="d-block w-100" alt="${room.name}">`;
      carouselInner.appendChild(div);
    });
  });
})();
