// admin.js
// Quản lý danh sách bài đăng - xem, xóa, cập nhật tạm thời

import { getRooms, deleteRoom } from "./roomsStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("adminRoomList");

  function renderRooms() {
    listContainer.innerHTML = "";
    const rooms = getRooms();

    if (rooms.length === 0) {
      listContainer.innerHTML = "<p>Chưa có bài đăng nào.</p>";
      return;
    }

    rooms.forEach((room) => {
      const item = document.createElement("div");
      item.className = "border rounded p-3 mb-2 bg-white shadow";
      item.innerHTML = `
        <h6 class="fw-bold">${room.title}</h6>
        <p><b>Giá:</b> ${room.price}</p>
        <p><b>Địa chỉ:</b> ${room.location}</p>
        <p><b>Loại:</b> ${room.type}</p>
        <p><b>Diện tích:</b> ${room.size}</p>
        <button class="btn btn-sm btn-danger" data-id="${room.id}">Xóa</button>
      `;
      listContainer.appendChild(item);
    });

    // Xử lý nút xóa
    const deleteButtons = listContainer.querySelectorAll("button[data-id]");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        deleteRoom(Number(id));
        renderRooms();
      });
    });
  }

  renderRooms();
});
