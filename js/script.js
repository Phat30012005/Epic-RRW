// script.js - logic tổng hợp cho baidang.html, dangtin.html, danhsach.html, chitiet.html, admin.html
(function () {
  // -------- Modal đơn giản --------
  function showAlert(message) {
    const o = document.createElement("div");
    o.className = "modal-overlay";
    o.innerHTML = `<div class="modal-content"><p>${message}</p><button>Đóng</button></div>`;
    document.body.appendChild(o);
    o.querySelector("button").addEventListener("click", () => o.remove());
  }

  function showConfirm(message, onConfirm) {
    const o = document.createElement("div");
    o.className = "modal-overlay";
    o.innerHTML = `<div class="modal-content"><p>${message}</p>
      <div><button id="yes">Đồng ý</button><button id="no">Hủy</button></div></div>`;
    document.body.appendChild(o);
    o.querySelector("#yes").addEventListener("click", () => {
      onConfirm();
      o.remove();
    });
    o.querySelector("#no").addEventListener("click", () => o.remove());
  }

  // -------- Navigation active --------
  function setupNavigation() {
    const path = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href === path || (href === "baidang.html" && path === "")) {
        link.classList.add("bg-gray-200");
      } else {
        link.classList.remove("bg-gray-200");
      }
    });
  }

  // -------- Trang: Đăng tin --------
  function setupDangTinPage() {
    setupNavigation();
    const postForm = document.getElementById("postForm");
    if (!postForm) return;

    const wardHidden = document.getElementById("ward-hidden");
    const trigger = document.getElementById("ward-custom-select");
    const dropdown = document.getElementById("ward-dropdown");
    if (!wardHidden || !trigger || !dropdown) return;

    const WARDS = window.CAN_THO_WARDS?.length
      ? window.CAN_THO_WARDS
      : ["An Cư (Ninh Kiều)", "Bình Thủy (Bình Thủy)", "Cái Răng (Cái Răng)"];

    dropdown.innerHTML = "";
    WARDS.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = w;
      li.dataset.value = w;
      li.addEventListener("click", () => {
        wardHidden.value = w;
        trigger.textContent = w;
        dropdown.classList.add("hidden");
      });
      dropdown.appendChild(li);
    });

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    // preview ảnh
    const imageInput = document.getElementById("images");
    const imagePreviewContainer = document.getElementById("image-preview");
    imageInput?.addEventListener("change", () => {
      imagePreviewContainer.innerHTML = "";
      Array.from(imageInput.files || [])
        .slice(0, 10)
        .forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.className = "image-preview-item";
            imagePreviewContainer.appendChild(img);
          };
          reader.readAsDataURL(file);
        });
    });

    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const requiredEls = postForm.querySelectorAll("[required]");
      for (let el of requiredEls) {
        if (!el.value.trim()) {
          showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.");
          return;
        }
      }
      if (!wardHidden.value) {
        showAlert("Vui lòng chọn Phường/Xã");
        return;
      }

      const files = Array.from(imageInput.files || []);
      const images = [];
      for (let i = 0; i < files.length && i < 10; i++) {
        images.push(
          await new Promise((res) => {
            const r = new FileReader();
            r.onload = (ev) => res(ev.target.result);
            r.readAsDataURL(files[i]);
          })
        );
      }
      if (!images.length) images.push("images/default.jpg");

      const newPost = {
        title: document.getElementById("title").value.trim(),
        motelName: document.getElementById("motelName").value.trim(),
        type: document.getElementById("type")?.value || "",
        price: Number(document.getElementById("price").value) || 0,
        area: Number(document.getElementById("area").value) || 0,
        rooms: Number(document.getElementById("rooms").value) || 1,
        ward: wardHidden.value,
        address: document.getElementById("address").value.trim(),
        description: document.getElementById("description").value.trim(),
        contactName: document.getElementById("contactName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        highlights: Array.from(
          document.querySelectorAll('input[name="highlight"]:checked')
        ).map((i) => i.value),
        images,
        date: new Date().toLocaleDateString("vi-VN"),
      };

      window.roomsStorage.addPost(newPost);
      showAlert("Tin đã được đăng thành công!");
      setTimeout(() => (window.location.href = "danhsach.html"), 500);
    });
  }

  // Khởi động theo trang
  document.addEventListener("DOMContentLoaded", () => {
    setupDangTinPage();
  });
})();
