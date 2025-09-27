document.addEventListener("DOMContentLoaded", () => {
  let rooms = JSON.parse(localStorage.getItem("rooms") || "[]");

  const roomList = document.getElementById("roomList");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    roomList.innerHTML =
      "<p>Chưa có phòng nào. <a href='dangtin.html'>Đăng tin ngay</a></p>";
    return;
  }

  rooms.forEach((r) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${r.images[0]}" class="card-img-top" alt="${r.name}">
        <div class="card-body">
          <h5 class="card-title">${r.name}</h5>
          <p class="card-text">${r.desc}</p>
          <p><strong>Vị trí:</strong> ${r.location}</p>
          <p><strong>Giá:</strong> ${r.price.toLocaleString()} đ/tháng</p>
        </div>
      </div>`;
    roomList.appendChild(col);
  });
});
