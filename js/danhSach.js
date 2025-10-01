const filterType = document.getElementById("filterType");
const filterPrice = document.getElementById("filterPrice");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const roomList = document.getElementById("roomList");

function getRooms() {
  return window.getRooms ? window.getRooms() : [];
}
let currentRooms = getRooms();

function renderRooms(rooms) {
  roomList.innerHTML = "";
  if (!rooms.length) {
    roomList.innerHTML = `<p class="text-center">Không có phòng nào.</p>`;
    return;
  }
  rooms.forEach((room) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-3";
    div.innerHTML = `
      <img src="${
        room.images?.[0] || "images/placeholder.jpg"
      }" class="w-full h-40 object-cover mb-2">
      <h5>${room.name}</h5>
      <p>${room.address}</p>
      <p class="fw-bold">${room.price} đ</p>
      <a href="chitiet.html" class="btn btn-sm btn-primary">Xem chi tiết</a>
    `;
    roomList.appendChild(div);
  });
}

function applyFilters() {
  let rooms = getRooms();
  const type = filterType?.value;
  if (type) rooms = rooms.filter((r) => r.type === type);
  const priceFilter = filterPrice?.value;
  if (priceFilter === "duoi2") rooms = rooms.filter((r) => r.price < 2000000);
  else if (priceFilter === "2-5")
    rooms = rooms.filter((r) => r.price >= 2000000 && r.price <= 5000000);
  else if (priceFilter === "tren5")
    rooms = rooms.filter((r) => r.price > 5000000);
  const keyword = searchInput?.value.toLowerCase();
  if (keyword)
    rooms = rooms.filter((r) => r.name.toLowerCase().includes(keyword));
  const sort = sortSelect?.value;
  if (sort === "gia-tang") rooms.sort((a, b) => a.price - b.price);
  else if (sort === "gia-giam") rooms.sort((a, b) => b.price - a.price);
  else if (sort === "ten") rooms.sort((a, b) => a.name.localeCompare(b.name));
  currentRooms = rooms;
  renderRooms(currentRooms);
}

searchInput?.addEventListener("input", applyFilters);
filterType?.addEventListener("change", applyFilters);
filterPrice?.addEventListener("change", applyFilters);
sortSelect?.addEventListener("change", applyFilters);

renderRooms(currentRooms);
