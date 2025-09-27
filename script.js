// ================================
// 1. DỮ LIỆU MẪU + LOCALSTORAGE
// ================================
const sampleRooms = [
  {
    id: 1,
    name: "Phòng trọ giá rẻ Quận 1",
    type: "Trọ",
    price: 1500000,
    address: "123 Nguyễn Thị Minh Khai, Q1, TP.HCM",
    images: ["images/room1.jpg", "images/room1b.jpg"],
    description: "Phòng rộng rãi, gần trung tâm, an ninh tốt.",
    hot: true,
  },
  {
    id: 2,
    name: "Căn hộ mini Q3",
    type: "Căn hộ",
    price: 4500000,
    address: "45 Lê Văn Sỹ, Q3, TP.HCM",
    images: ["images/room2.jpg"],
    description: "Căn hộ đầy đủ tiện nghi, phù hợp gia đình nhỏ.",
    hot: false,
  },
  {
    id: 3,
    name: "Phòng trọ sinh viên Thủ Đức",
    type: "Trọ",
    price: 1800000,
    address: "12 Võ Văn Ngân, Thủ Đức, TP.HCM",
    images: ["images/room3.jpg"],
    description: "Phòng sạch sẽ, gần ĐH SPKT, giá hợp lý.",
    hot: false,
  },
];
const STORAGE_KEY = "roomsData";

function getRooms() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}
function saveRooms(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Khởi tạo data lần đầu
if (!localStorage.getItem(STORAGE_KEY)) {
  saveRooms(sampleRooms);
}

// Biến toàn cục
let rooms = getRooms();
let currentPage = 1;
const itemsPerPage = 6;

// Bootstrap modal
const roomModal = new bootstrap.Modal(document.getElementById("roomModal"));

// ================================
// 2. XỬ LÝ TRANG ĐĂNG TIN (dangtin.html)
// ================================
const postForm = document.getElementById("postForm");
if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Lấy giá trị user nhập
    const name = document.getElementById("roomName").value.trim();
    const imageUrl = document.getElementById("roomImage").value.trim();
    const location = document.getElementById("roomLocation").value.trim();
    const price = Number(document.getElementById("roomPrice").value);
    const rating = Number(document.getElementById("roomRating").value);

    if (!name || !imageUrl || !location || !price || !rating) {
      return alert("Vui lòng điền đầy đủ thông tin.");
    }

    const newRoom = {
      id: Date.now(),
      name,
      type: "Trọ",
      price,
      address: location,
      images: [imageUrl],
      description: "",
      hot: false,
    };

    rooms = getRooms();
    rooms.push(newRoom);
    saveRooms(rooms);

    alert("Đăng tin thành công!");
    window.location.href = "danhsach.html";
  });
}

// ================================
// 3. XỬ LÝ TRANG DANH SÁCH (danhsach.html)
// ================================
const roomListEl = document.getElementById("roomList");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const filterPrice = document.getElementById("filterPrice");
const sortSelect = document.getElementById("sortSelect");
const paginationEl = document.getElementById("pagination");
const activeFiltersEl = document.getElementById("activeFilters");

if (roomListEl) {
  renderRooms();

  // Gắn sự kiện tìm kiếm, lọc, sắp xếp
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
  sortSelect.addEventListener("change", () => {
    renderRooms();
  });
}

// Hàm chính: render và cập nhật mọi thứ
function renderRooms() {
  rooms = getRooms();
  let filtered = rooms.filter((r) => {
    const q = searchInput.value.trim().toLowerCase();
    const type = filterType.value;
    const price = filterPrice.value;

    if (q && !r.name.toLowerCase().includes(q)) return false;
    if (type && r.type !== type) return false;
    if (price === "duoi2" && r.price >= 2000000) return false;
    if (price === "2-5" && (r.price < 2000000 || r.price > 5000000))
      return false;
    if (price === "tren5" && r.price <= 5000000) return false;
    return true;
  });

  // Sort
  const sort = sortSelect.value;
  if (sort === "gia-tang") filtered.sort((a, b) => a.price - b.price);
  if (sort === "gia-giam") filtered.sort((a, b) => b.price - a.price);
  if (sort === "ten") filtered.sort((a, b) => a.name.localeCompare(b.name));

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  // Render cards
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
          <p class="card-text text-success mb-1">${r.price.toLocaleString()} VND</p>
          <button class="btn btn-primary w-100" onclick="showRoom(${
            r.id
          })">Xem thêm</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  renderPagination(totalPages);
  bindFavoriteEvents();
  renderActiveFilters();
}

// Pagination
function renderPagination(totalPages) {
  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<li class="page-item ${i === currentPage ? "active" : ""}">
      <a class="page-link" href="#" onclick="gotoPage(${i});return false;">${i}</a>
    </li>`;
  }
  paginationEl.innerHTML = html;
}
function gotoPage(p) {
  currentPage = p;
  renderRooms();
}

// Favorite
function isFavorite(id) {
  const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
  return fav.includes(id);
}
function toggleFavorite(id) {
  let fav = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (fav.includes(id)) fav = fav.filter((x) => x !== id);
  else fav.push(id);
  localStorage.setItem("favorites", JSON.stringify(fav));
  renderRooms();
}
function bindFavoriteEvents() {
  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      toggleFavorite(id);
    });
  });
}

// Active filter tags
function renderActiveFilters() {
  const q = searchInput.value.trim();
  const type = filterType.value;
  const price = filterPrice.value;
  let tags = "";

  if (q) tags += `<span class="badge bg-primary me-2">Từ khóa: ${q}</span>`;
  if (type) tags += `<span class="badge bg-success me-2">Loại: ${type}</span>`;
  if (price) {
    const t = price === "duoi2" ? "<2tr" : price === "2-5" ? "2-5tr" : ">5tr";
    tags += `<span class="badge bg-warning text-dark me-2">${t}</span>`;
  }

  activeFiltersEl.innerHTML = tags;
}

// Modal detail + Google Map
function showRoom(id) {
  const r = getRooms().find((x) => x.id === id);
  if (!r) return;

  document.getElementById("modalTitle").textContent = r.name;
  document.getElementById("modalDescription").textContent = r.description;
  document.getElementById("modalPrice").textContent =
    r.price.toLocaleString() + " VND";
  document.getElementById("modalAddress").textContent = r.address;

  // Carousel images
  const carouselInner = document.getElementById("carouselInner");
  carouselInner.innerHTML = r.images
    .map(
      (img, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="${img}" class="d-block w-100" alt="${r.name}">
    </div>
  `
    )
    .join("");

  // Embed Google Maps
  document.getElementById("modalMap").innerHTML = `
    <iframe 
      src="https://www.google.com/maps?q=${encodeURIComponent(
        r.address
      )}&output=embed" 
      width="100%" height="100%" style="border:0;"
    ></iframe>`;

  roomModal.show();
}
