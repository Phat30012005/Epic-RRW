/* =======================================
   --- FILE: js/dangtin.js ---
   (Logic xử lý Form Đăng tin)
   ======================================= */

// Dữ liệu Phường/Xã Cần Thơ (Giữ nguyên)
const CAN_THO_WARDS = [
  "An Cư (Ninh Kiều)",
  "An Hòa (Ninh Kiều)",
  "An Khánh (Ninh Kiều)",
  "An Lạc (Ninh Kiều)",
  "An Nghiệp (Ninh Kiều)",
  "An Phú (Ninh Kiều)",
  "Cái Khế (Ninh Kiều)",
  "Hưng Lợi (Ninh Kiều)",
  "Tân An (Ninh Kiều)",
  "Thới Bình (Ninh Kiều)",
  "Xuân Khánh (Ninh Kiều)",
  "An Thới (Bình Thủy)",
  "Bình Thủy (Bình Thủy)",
  "Bùi Hữu Nghĩa (Bình Thủy)",
  "Long Hòa (Bình Thủy)",
  "Long Tuyền (Bình Thủy)",
  "Phú Thứ (Cái Răng)",
  "Hưng Phú (Cái Răng)",
  "Hưng Thạnh (Cái Răng)",
  "Lê Bình (Cái Răng)",
  "Thường Thạnh (Cái Răng)",
  "Tân Phú (Cái Răng)",
  "Ba Láng (Cái Răng)",
  "Thốt Nốt (Thốt Nốt)",
  "Thới Thuận (Thốt Nốt)",
  "Trung Kiên (Thốt Nốt)",
  "Thuận An (Thốt Nốt)",
  "Thạnh An (Thốt Nốt)",
  "Trà Nóc (Ô Môn)",
  "Phước Thới (Ô Môn)",
  "Thới An (Ô Môn)",
  "Thới Long (Ô Môn)",
  "Long Hưng (Ô Môn)",
  "Đông Thuận (Ô Môn)",
  "Tân Hưng (Ô Môn)",
  "Trung Hưng (Cờ Đỏ)",
  "Đông Thắng (Cờ Đỏ)",
  "Thạnh Phú (Cờ Đỏ)",
  "Thới Hưng (Cờ Đỏ)",
  "Thới Xuân (Cờ Đỏ)",
  "Thới Lai (Thới Lai)",
  "Xuân Thắng (Thới Lai)",
  "Tân Thạnh (Thới Lai)",
  "Định Môn (Thới Lai)",
  "Trường Lạc (Thới Lai)",
  "Phong Điền (Phong Điền)",
  "Giai Xuân (Phong Điền)",
  "Mỹ Khánh (Phong Điền)",
  "Nhơn Ái (Phong Điền)",
  "Nhơn Nghĩa (Phong Điền)",
  "Trường Thành (Thới Lai)",
];

/**
 * Thiết lập logic chính cho trang Đăng Tin, bao gồm Select Phường/Xã và Image Preview.
 */
window.setupDangTinPage = function () {
  const postForm = document.getElementById("postForm");
  const imageInput = document.getElementById("images");
  const imagePreviewContainer = document.getElementById("image-preview");

  // ===========================================
  // LOGIC: SELECT BOX TÙY CHỈNH CHO PHƯỜNG/XÃ
  // ===========================================
  const wardHiddenInput = document.getElementById("ward-hidden");
  const customSelectTrigger = document.getElementById("ward-custom-select");
  const customDropdown = document.getElementById("ward-dropdown");

  // 1. Load Wards vào Dropdown tùy chỉnh
  CAN_THO_WARDS.forEach((ward) => {
    const li = document.createElement("li");
    li.textContent = ward;
    li.setAttribute("data-value", ward);
    customDropdown.appendChild(li);

    li.addEventListener("click", () => {
      wardHiddenInput.value = ward;
      customSelectTrigger.textContent = ward;
      customDropdown.classList.add("hidden");
    });
  });

  // 2. Xử lý mở/đóng Dropdown
  customSelectTrigger.addEventListener("click", () => {
    customDropdown.classList.toggle("hidden");
  });

  // 3. Đóng khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (
      !customSelectTrigger.contains(e.target) &&
      !customDropdown.contains(e.target)
    ) {
      customDropdown.classList.add("hidden");
    }
  });

  // Handle image preview
  imageInput.addEventListener("change", () => {
    imagePreviewContainer.innerHTML = "";
    if (imageInput.files) {
      Array.from(imageInput.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "image-preview-item";
          imagePreviewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  // Thêm event listener cho form submit
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await submitPost(wardHiddenInput.value);
  });
};

/**
 * Xử lý logic submit form, kiểm tra validation, và lưu dữ liệu.
 */
async function submitPost(selectedWardValue) {
  const form = document.getElementById("postForm");
  const allInputs = form.querySelectorAll("input, select, textarea");
  let isFormValid = true;

  // Kiểm tra các trường required (validation)
  allInputs.forEach((input) => {
    if (input.id === "ward-hidden") return;

    if (input.hasAttribute("required") && !input.value) {
      isFormValid = false;
    }
  });

  if (!selectedWardValue) {
    isFormValid = false;
  }

  if (!isFormValid) {
    // Sử dụng hàm toàn cục showAlert từ main.js
    showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.");
    return;
  }

  const imageInput = document.getElementById("images");
  const imageFiles = imageInput.files;
  const base64Images = [];

  // Chuyển đổi ảnh sang Base64
  if (imageFiles.length > 0) {
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      base64Images.push(base64);
    }
  } else {
    base64Images.push(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABpL3g+AAAAA1BMVEW+v78nB7LFAAAAJUlEQVR4nO3BAQ0AAADCoPdPbQ8H/wwAAAAAAAAAAAAAAAB+gABBAAECBL8nJgAAAABJRU5ErkJggg=="
    );
  }

  // Thu thập dữ liệu
  const newPost = {
    title: document.getElementById("title").value,
    motelName: document.getElementById("motelName").value,
    price: document.getElementById("price").value,
    area: document.getElementById("area").value,
    rooms: document.getElementById("rooms").value,
    ward: selectedWardValue,
    address: document.getElementById("address").value,
    description: document.getElementById("description").value,
    contactName: document.getElementById("contactName").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    highlights: Array.from(
      document.querySelectorAll('input[name="highlight"]:checked')
    ).map((el) => el.value),
    images: base64Images,
    date: new Date().toLocaleDateString("vi-VN"),
  };

  // Lưu và chuyển hướng
  const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  storedPosts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(storedPosts));

  showAlert("Tin đã được đăng thành công!");

  setTimeout(() => {
    window.location.href = "danhsach.html";
  }, 1500);
}
