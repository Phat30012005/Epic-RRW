// Lấy các phần tử giao diện
const filterType = document.getElementById("filterType");
const filterPrice = document.getElementById("filterPrice");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const roomList = document.getElementById("roomList");
const emptyState = document.getElementById("emptyState");

// Sử dụng hàm từ roomsStorage.js
function getRooms() {
  return window.getRooms ? window.getRooms() : [];
}

let currentRooms = getRooms();

// Hàm hiển thị danh sách phòng
function renderRooms(rooms) {
  roomList.innerHTML = "";

  if (!rooms.length) {
    roomList.innerHTML = `<p class="text-center text-gray-500">Không tìm thấy phòng nào.</p>`;
    if (emptyState) emptyState.style.display = "block";
    return;
  } else {
    if (emptyState) emptyState.style.display = "none";
  }

  rooms.forEach((room) => {
    const col = document.createElement("div");
    col.className = "bg-white rounded-lg shadow-md overflow-hidden";

    const firstImage = room.images?.[0] || "images/default.jpg";

    col.innerHTML = `
      <img src="${firstImage}" class="w-full h-48 object-cover" alt="${
      room.name
    }">
      <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800">${room.name}</h2>
        <p class="text-gray-600">${room.description}</p>
        <p class="text-indigo-600 font-bold">${room.price.toLocaleString()} đ</p>
        <p class="text-sm text-gray-500">Đánh giá: ${
          room.rating ?? "Chưa có"
        } ⭐</p>
        ${
          room.type === "Ghép"
            ? `<p class="text-sm text-gray-600">Số người: ${
                room.currentOccupants || 0
              }/${room.maxOccupants || "?"}</p>`
            : ""
        }
        <button class="mt-2 btn btn-sm btn-primary" 
                data-bs-toggle="modal" 
                data-bs-target="#roomModal" 
                data-id="${room.id}">
          Xem chi tiết
        </button>
      </div>
    `;
    roomList.appendChild(col);
  });
}

// Hàm áp dụng bộ lọc
function applyFilters() {
  let rooms = getRooms();

  // Lọc theo loại phòng
  const type = filterType?.value;
  if (type) {
    rooms = rooms.filter((r) => r.type === type);
  }

  // Lọc theo giá
  const priceFilter = filterPrice?.value;
  if (priceFilter === "duoi2") {
    rooms = rooms.filter((r) => r.price < 2000000);
  } else if (priceFilter === "2-5") {
    rooms = rooms.filter((r) => r.price >= 2000000 && r.price <= 5000000);
  } else if (priceFilter === "tren5") {
    rooms = rooms.filter((r) => r.price > 5000000);
  }

  // Tìm kiếm theo từ khóa
  const keyword = searchInput?.value.toLowerCase();
  if (keyword) {
    rooms = rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.description.toLowerCase().includes(keyword)
    );
  }

  // Sắp xếp
  const sort = sortSelect?.value;
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

// Gắn sự kiện thay đổi bộ lọc
searchInput?.addEventListener("input", applyFilters);
filterType?.addEventListener("change", applyFilters);
filterPrice?.addEventListener("change", applyFilters);
sortSelect?.addEventListener("change", applyFilters);

// Hiển thị danh sách ban đầu
renderRooms(currentRooms);

// Xử lý modal hiển thị chi tiết phòng
const roomModal = document.getElementById("roomModal");
roomModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const id = button.getAttribute("data-id");
  const room = getRooms().find((r) => r.id == id);

  if (!room) return;

  document.getElementById("modalTitle").innerText = room.name;
  document.getElementById("modalDescription").innerText = room.description;
  document.getElementById("modalPrice").innerText =
    room.price.toLocaleString() + " đ";
  document.getElementById("modalAddress").innerText = room.address;

  // Hiển thị hình ảnh trong carousel
  const carouselInner = document.getElementById("carouselInner");
  carouselInner.innerHTML = "";

  (room.images || []).forEach((img, index) => {
    const div = document.createElement("div");
    div.className = `carousel-item ${index === 0 ? "active" : ""}`;
    div.innerHTML = `<img src="${img}" class="d-block w-100" alt="${room.name}">`;
    carouselInner.appendChild(div);
  });

  document.querySelector(".carousel-control-prev").style.display =
    room.images?.length > 1 ? "block" : "none";
  document.querySelector(".carousel-control-next").style.display =
    room.images?.length > 1 ? "block" : "none";
});
