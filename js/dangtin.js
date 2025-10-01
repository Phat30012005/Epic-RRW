// dangtin.js
// Xử lý form đăng tin - lưu dữ liệu tạm thời vào localStorage thông qua roomsStorage.js

import { addRoom } from "./roomsStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dangtinForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Lấy dữ liệu từ form (placeholder - sau này gắn với backend)
      const newRoom = {
        id: Date.now(),
        title: document.getElementById("title").value || "Tiêu đề phòng",
        price: document.getElementById("price").value || "Giá phòng",
        location: document.getElementById("location").value || "Địa chỉ",
        type: document.getElementById("type").value || "Loại phòng",
        size: document.getElementById("size").value || "Diện tích",
        description: document.getElementById("description").value || "Mô tả",
        image: document.getElementById("image").value || "placeholder.jpg",
      };

      addRoom(newRoom);

      alert(
        "Tin của bạn đã được đăng tạm. (Sẽ cập nhật DB khi backend Python hoạt động)"
      );
      form.reset();
    });
  }
});
