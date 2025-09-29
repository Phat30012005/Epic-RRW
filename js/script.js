// Dữ liệu Phường/Xã Cần Thơ (Đã được sắp xếp theo cấp độ Phường/Xã)
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

// Các hàm tiện ích
function showAlert(message) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.innerHTML = `
        <div class="modal-content">
            <p class="text-lg font-semibold mb-4">${message}</p>
            <button onclick="this.closest('.modal-overlay').remove()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Đóng</button>
        </div>
    `;
  document.body.appendChild(modalOverlay);
}

function showConfirm(message, onConfirm) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.innerHTML = `
        <div class="modal-content">
            <p class="text-lg font-semibold mb-4">${message}</p>
            <div class="flex justify-center space-x-4">
                <button id="confirm-yes" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Đồng ý</button>
                <button id="confirm-no" class="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition">Hủy</button>
            </div>
        </div>
    `;
  document.body.appendChild(modalOverlay);

  document.getElementById("confirm-yes").onclick = () => {
    onConfirm();
    modalOverlay.remove();
  };
  document.getElementById("confirm-no").onclick = () => {
    modalOverlay.remove();
  };
}

// Logic chung
function setupNavigation() {
  const path = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    // Loại bỏ logic active cho nav-brand (Chicky.stu)
    if (link.classList.contains("nav-brand")) {
      link.classList.remove("bg-gray-200");
      return;
    }

    if (link.getAttribute("href") === path) {
      link.classList.add("bg-gray-200");
    } else {
      link.classList.remove("bg-gray-200");
    }
  });
}

// Logic cho trang Đăng Tin
function setupDangTinPage() {
  setupNavigation();

  const postForm = document.getElementById("postForm");

  // XÓA: const wardSelect = document.getElementById('ward'); // Không dùng nữa
  const imageInput = document.getElementById("images");
  const imagePreviewContainer = document.getElementById("image-preview");

  // ===========================================
  // LOGIC MỚI: SELECT BOX TÙY CHỈNH CHO PHƯỜNG/XÃ
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
      // Cập nhật giá trị vào input ẩn và trigger hiển thị
      wardHiddenInput.value = ward;
      customSelectTrigger.textContent = ward;
      customDropdown.classList.add("hidden"); // Đóng dropdown
    });
  });

  // 2. Xử lý mở/đóng Dropdown
  customSelectTrigger.addEventListener("click", () => {
    customDropdown.classList.toggle("hidden");
  });

  // 3. Đóng khi click ra ngoài
  document.addEventListener("click", (e) => {
    // Chỉ đóng nếu click ra ngoài cả trigger và dropdown
    if (
      !customSelectTrigger.contains(e.target) &&
      !customDropdown.contains(e.target)
    ) {
      customDropdown.classList.add("hidden");
    }
  });
  // ===========================================
  // KẾT THÚC LOGIC MỚI
  // ===========================================

  // Handle image preview
  imageInput.addEventListener("change", () => {
    // ... (Giữ nguyên logic image preview) ...
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
    // TRUYỀN GIÁ TRỊ TỪ INPUT ẨN VÀO HÀM SUBMITPOST
    await submitPost(wardHiddenInput.value);
  });
}

// CHỈNH SỬA: Thêm tham số selectedWardValue
async function submitPost(selectedWardValue) {
  const form = document.getElementById("postForm");
  const allInputs = form.querySelectorAll("input, select, textarea");
  let isFormValid = true;

  allInputs.forEach((input) => {
    // Bỏ qua thẻ select/input cũ/ẩn để kiểm tra
    if (input.id === "ward" || input.id === "ward-hidden") return;

    if (input.hasAttribute("required") && !input.value) {
      isFormValid = false;
    }
  });

  // KIỂM TRA RIÊNG TRƯỜNG PHƯỜNG/XÃ
  if (!selectedWardValue) {
    isFormValid = false;
  }

  if (!isFormValid) {
    showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.");
    return;
  }

  const imageInput = document.getElementById("images");
  // ... (Giữ nguyên logic load ảnh) ...
  const imageFiles = imageInput.files;
  const base64Images = [];

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
    ); // placeholder
  }

  const newPost = {
    title: document.getElementById("title").value,
    motelName: document.getElementById("motelName").value,
    price: document.getElementById("price").value,
    area: document.getElementById("area").value,
    rooms: document.getElementById("rooms").value,
    ward: selectedWardValue, // LẤY GIÁ TRỊ TỪ SELECT TÙY CHỈNH
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

  // ... (Giữ nguyên logic lưu và chuyển trang) ...
  const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  storedPosts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(storedPosts));
  showAlert("Tin đã được đăng thành công!");
  setTimeout(() => {
    window.location.href = "danhsach.html";
  }, 1500);
}

// Logic cho trang Danh Sách
function setupDanhSachPage() {
  setupNavigation();
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const container = document.getElementById("posts-container");
  if (posts.length === 0) {
    container.innerHTML =
      '<p class="text-center text-gray-500 col-span-full">Chưa có tin nào được đăng.</p>';
  } else {
    posts.forEach((post, index) => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";
      postCard.onclick = () => {
        window.location.href = `chitiet.html?id=${index}`;
      };
      // Cập nhật hiển thị địa chỉ chỉ còn Phường/Xã
      postCard.innerHTML = `
                <img src="${post.images[0]}" alt="${
        post.title
      }" class="post-thumbnail">
                <div class="post-content">
                    <h2 class="text-lg font-semibold text-gray-800 truncate">${
                      post.title
                    }</h2>
                    <p class="text-xl font-bold text-red-500 my-2">${Number(
                      post.price
                    ).toLocaleString("vi-VN")} VNĐ</p>
                    <p class="text-gray-600 text-sm">${post.area} m² - ${
        post.ward || "Cần Thơ"
      }</p>
                    <p class="text-gray-500 text-xs mt-1">Đăng ngày: ${
                      post.date
                    }</p>
                </div>
            `;
      container.appendChild(postCard);
    });
  }
}

// Logic cho trang Chi Tiết
function setupChiTietPage() {
  setupNavigation();
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (postId !== null && posts[postId]) {
    const post = posts[postId];

    // CẬP NHẬT: Tiêu đề tin (post.title) hiện ở vị trí màu đỏ (trên cùng)
    const pageTitleEl = document.getElementById("detail-page-title");
    if (pageTitleEl) {
      pageTitleEl.textContent = post.title;
    }

    // CẬP NHẬT: Tên trọ (post.motelName) hiện ở vị trí màu xanh (ngay dưới ảnh)
    document.getElementById("detail-title").textContent =
      post.motelName || post.title; // Dùng tên trọ, nếu không có thì dùng tiêu đề

    document.getElementById("detail-price").textContent = `${Number(
      post.price
    ).toLocaleString("vi-VN")} VNĐ`;
    document.getElementById("detail-area").textContent = `${post.area} m²`;
    document.getElementById("detail-rooms").textContent = post.rooms;

    // Cập nhật hiển thị địa chỉ chỉ còn Phường/Xã
    document.getElementById("detail-ward").textContent = post.ward;
    document.getElementById("detail-address").textContent = post.address;

    document.getElementById("detail-contact-name").textContent =
      post.contactName;
    document.getElementById("detail-phone").textContent = post.phone;
    document.getElementById("detail-email").textContent = post.email;
    document.getElementById("detail-description").textContent =
      post.description;
    document.getElementById(
      "detail-date"
    ).textContent = `Đăng ngày: ${post.date}`;

    // ===============================================
    // LOGIC HIỂN THỊ ẢNH (SLIDER/GALLERY) -
    // ===============================================
    const imageDisplayContainer = document.getElementById(
      "detail-images-display"
    ); // Ảnh chính
    const thumbnailContainer = document.getElementById("detail-thumbnails"); // Ảnh nhỏ
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    let currentImageIndex = 0;

    imageDisplayContainer.innerHTML = "";
    thumbnailContainer.innerHTML = "";

    // 1. Tạo và thêm tất cả ảnh chính và thumbnail
    post.images.forEach((imgSrc, index) => {
      // Thêm ảnh chính (ban đầu ẩn hết, CSS sẽ xử lý)
      const mainImg = document.createElement("img");
      mainImg.src = imgSrc;
      mainImg.alt = post.title;
      imageDisplayContainer.appendChild(mainImg);

      // Thêm thumbnail
      const thumbnailImg = document.createElement("img");
      thumbnailImg.src = imgSrc;
      thumbnailImg.alt = `Thumbnail ${index + 1}`;
      thumbnailImg.className = "thumbnail-item";
      thumbnailImg.dataset.index = index;
      thumbnailContainer.appendChild(thumbnailImg);

      // Thêm sự kiện click cho thumbnail
      thumbnailImg.addEventListener("click", () => {
        showImage(index);
      });
    });

    const mainImages = imageDisplayContainer.querySelectorAll("img");
    const thumbnails = thumbnailContainer.querySelectorAll(".thumbnail-item");

    // Hàm hiển thị ảnh
    function showImage(index) {
      if (mainImages.length === 0) return;
      // Ẩn/hiện ảnh chính
      mainImages.forEach((img) => img.classList.remove("active"));
      mainImages[index].classList.add("active");

      // Cập nhật trạng thái active cho thumbnail
      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      thumbnails[index].classList.add("active");

      // Cuộn đến thumbnail đang active
      thumbnails[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });

      currentImageIndex = index;
    }

    // Xử lý nút NEXT
    nextBtn.addEventListener("click", () => {
      let newIndex = currentImageIndex + 1;
      if (newIndex >= mainImages.length) {
        newIndex = 0; // Quay lại ảnh đầu
      }
      showImage(newIndex);
    });

    // Xử lý nút PREV
    prevBtn.addEventListener("click", () => {
      let newIndex = currentImageIndex - 1;
      if (newIndex < 0) {
        newIndex = mainImages.length - 1; // Quay lại ảnh cuối
      }
      showImage(newIndex);
    });

    // Hiển thị ảnh đầu tiên khi tải trang
    if (mainImages.length > 0) {
      showImage(0);
    }

    // ===============================================
    // KẾT THÚC LOGIC ẢNH
    // ===============================================

    const highlightContainer = document.getElementById("detail-highlights");
    highlightContainer.innerHTML = "";
    post.highlights.forEach((highlight) => {
      const span = document.createElement("span");
      span.className = "highlight-item";
      span.textContent = highlight;
      highlightContainer.appendChild(span);
    });
  } else {
    document.body.innerHTML =
      '<p class="text-center mt-20 text-xl font-bold">Không tìm thấy tin đăng này.</p>';
  }
}

// Logic cho trang Admin
function setupAdminPage() {
  setupNavigation();
  const adminPanel = document.getElementById("admin-panel");
  const passwordForm = document.getElementById("password-form");

  // Check if user is already logged in
  if (sessionStorage.getItem("adminLoggedIn")) {
    passwordForm.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadPosts();
  } else {
    passwordForm.classList.remove("hidden");
    adminPanel.classList.add("hidden");
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const passwordInput = document.getElementById("password");
      if (passwordInput.value === "123") {
        // Mật khẩu cứng
        sessionStorage.setItem("adminLoggedIn", "true");
        passwordForm.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        loadPosts();
      } else {
        showAlert("Mật khẩu không đúng!");
        passwordInput.value = "";
      }
    });
  }
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const tableBody = document.getElementById("admin-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  if (posts.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" class="text-center text-gray-500">Chưa có tin nào.</td></tr>';
  } else {
    posts.forEach((post, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td><a href="chitiet.html?id=${index}" class="text-blue-600 hover:underline">${
        post.title
      }</a></td>
                <td>${Number(post.price).toLocaleString("vi-VN")} VNĐ</td>
                <td>${post.ward}</td>
                <td>${post.date}</td>
                <td><button onclick="deletePost(${index})" class="btn-delete">Xóa</button></td>
            `;
      tableBody.appendChild(row);
    });
  }
}

function deletePost(index) {
  showConfirm("Bạn có chắc chắn muốn xóa tin này không?", () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
    showAlert("Tin đã được xóa thành công!");
  });
}

// Vận hành chung cho tất cả các trang
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();
  if (path === "chitiet.html") {
    setupChiTietPage();
  } else if (path === "dangtin.html" || path === "") {
    setupDangTinPage();
  } else if (path === "danhsach.html") {
    setupDanhSachPage();
  } else if (path === "admin.html") {
    setupAdminPage();
  }
});
