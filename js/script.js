// script.js - logic tổng hợp cho dangtin.html, danhsach.html, chitiet.html, admin.html
(function () {
  // utilities: modal-like alert/confirm (simple)
  function showAlert(message) {
    const o = document.createElement("div");
    o.className = "modal-overlay";
    o.innerHTML = `<div class="modal-content"><p class="text-lg font-semibold mb-4">${message}</p><button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Đóng</button></div>`;
    document.body.appendChild(o);
    o.querySelector("button").addEventListener("click", () => o.remove());
  }

  function showConfirm(message, onConfirm) {
    const o = document.createElement("div");
    o.className = "modal-overlay";
    o.innerHTML = `<div class="modal-content"><p class="text-lg font-semibold mb-4">${message}</p><div class="flex justify-center space-x-4"><button id="yes" class="bg-red-500 text-white px-4 py-2 rounded-md">Đồng ý</button><button id="no" class="bg-gray-300 px-4 py-2 rounded-md">Hủy</button></div></div>`;
    document.body.appendChild(o);
    o.querySelector("#yes").addEventListener("click", () => {
      onConfirm();
      o.remove();
    });
    o.querySelector("#no").addEventListener("click", () => o.remove());
  }

  // navigation active
  function setupNavigation() {
    const path = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (href === path || (href === "index.html" && path === ""))
        link.classList.add("bg-gray-200");
      else link.classList.remove("bg-gray-200");
    });
  }

  /* --------------------------
     Page: Đăng tin (dangtin.html)
     -------------------------- */
  function setupDangTinPage() {
    setupNavigation();
    const postForm = document.getElementById("postForm");
    if (!postForm) return;

    // ward dropdown (CAN_THO_WARDS provided in previous versions; if not, simple fallback)
    const wardHidden = document.getElementById("ward-hidden");
    const trigger = document.getElementById("ward-custom-select");
    const dropdown = document.getElementById("ward-dropdown");

    // if CAN_THO_WARDS exists on window, use it; otherwise a small default
    const WARDS =
      window.CAN_THO_WARDS && window.CAN_THO_WARDS.length
        ? window.CAN_THO_WARDS
        : ["An Cư (Ninh Kiều)", "Bình Thủy (Bình Thủy)", "Cái Răng (Cái Răng)"];

    // populate dropdown
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
      if (!trigger.contains(e.target) && !dropdown.contains(e.target))
        dropdown.classList.add("hidden");
    });

    // image preview
    const imageInput = document.getElementById("images");
    const imagePreviewContainer = document.getElementById("image-preview");
    imageInput &&
      imageInput.addEventListener("change", () => {
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

    // submit handler
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // basic validation
      const requiredEls = postForm.querySelectorAll("[required]");
      for (let el of requiredEls) {
        if (!el.value || el.value.trim() === "") {
          showAlert("Vui lòng điền đầy đủ thông tin bắt buộc.");
          return;
        }
      }
      if (!wardHidden.value) {
        showAlert("Vui lòng chọn Phường/Xã");
        return;
      }

      // images -> base64 (for demo only)
      const files = Array.from(document.getElementById("images").files || []);
      const images = [];
      for (let i = 0; i < files.length && i < 10; i++) {
        images.push(
          await new Promise((resolve) => {
            const r = new FileReader();
            r.onload = (ev) => resolve(ev.target.result);
            r.readAsDataURL(files[i]);
          })
        );
      }
      if (images.length === 0) images.push("images/default.jpg");

      // collect fields
      const newPost = {
        title: document.getElementById("title").value.trim(),
        motelName: document.getElementById("motelName").value.trim(),
        type: document.getElementById("type")
          ? document.getElementById("type").value
          : "",
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

      // save via roomsStorage service
      const added = window.roomsStorage.addPost(newPost);
      showAlert("Tin đã được đăng thành công!");
      setTimeout(() => (window.location.href = "danhsach.html"), 900);
    });
  }

  /* --------------------------
     Page: Danh sách (danhsach.html)
     -------------------------- */
  function setupDanhSachPage() {
    setupNavigation();
    const postsContainer = document.getElementById("posts-container");
    if (!postsContainer) return;

    // elements (may not exist on all pages)
    const filterType = document.getElementById("filterType");
    const filterPrice = document.getElementById("filterPrice");
    const sortSelect = document.getElementById("sortSelect");
    const searchInput = document.getElementById("searchInput");
    const emptyState = document.getElementById("emptyState");

    // if 'searchResults' present (from quick search), use it then clear
    const sr = JSON.parse(localStorage.getItem("searchResults") || "null");
    if (sr && Array.isArray(sr)) {
      window.roomsStorage.savePosts(
        sr.concat(window.roomsStorage.getPosts().slice(sr.length))
      ); // not necessary but ensure visibility
      localStorage.removeItem("searchResults");
    }

    function getAll() {
      return window.roomsStorage.getPosts();
    }

    function render(rooms) {
      postsContainer.innerHTML = "";
      if (!rooms || rooms.length === 0) {
        postsContainer.innerHTML = `<p class="text-center text-gray-500 col-span-full">Chưa có tin nào được đăng.</p>`;
        if (emptyState) emptyState.style.display = "block";
        return;
      } else {
        if (emptyState) emptyState.style.display = "none";
      }
      rooms.forEach((post, index) => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.onclick = () =>
          (window.location.href = `chitiet.html?id=${index}`);
        card.innerHTML = `
          <img src="${post.images?.[0] || "images/default.jpg"}" alt="${
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
            <p class="text-gray-500 text-xs mt-1">Đăng ngày: ${post.date}</p>
          </div>`;
        postsContainer.appendChild(card);
      });
    }

    // initial render
    let current = getAll();
    render(current);

    // filters handlers (if elements exist)
    function applyFilters() {
      let rooms = getAll();
      if (filterType && filterType.value)
        rooms = rooms.filter((r) => r.type === filterType.value);
      if (filterPrice && filterPrice.value) {
        const v = filterPrice.value;
        if (v === "duoi2") rooms = rooms.filter((r) => r.price < 2000000);
        else if (v === "2-5")
          rooms = rooms.filter((r) => r.price >= 2000000 && r.price <= 5000000);
        else if (v === "tren5") rooms = rooms.filter((r) => r.price > 5000000);
      }
      if (searchInput && searchInput.value.trim()) {
        const q = searchInput.value.trim().toLowerCase();
        rooms = rooms.filter(
          (r) =>
            (r.title || "").toLowerCase().includes(q) ||
            (r.description || "").toLowerCase().includes(q)
        );
      }
      if (sortSelect && sortSelect.value) {
        if (sortSelect.value === "gia-tang")
          rooms.sort((a, b) => a.price - b.price);
        else if (sortSelect.value === "gia-giam")
          rooms.sort((a, b) => b.price - a.price);
        else if (sortSelect.value === "ten")
          rooms.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      }
      current = rooms;
      render(current);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterType) filterType.addEventListener("change", applyFilters);
    if (filterPrice) filterPrice.addEventListener("change", applyFilters);
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
  }

  /* --------------------------
     Page: Chi tiết (chitiet.html)
     -------------------------- */
  function setupChiTietPage() {
    setupNavigation();
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const posts = window.roomsStorage.getPosts();
    if (id === null || !posts[id]) {
      document.body.innerHTML =
        '<p class="text-center mt-20 text-xl font-bold">Không tìm thấy tin đăng này.</p>';
      return;
    }
    const post = posts[id];

    // fill fields
    const set = (sel, val) => {
      const el = document.getElementById(sel);
      if (el) el.textContent = val;
    };
    set("detail-page-title", post.title);
    set("detail-title", post.motelName || post.title);
    set("detail-price", `${Number(post.price).toLocaleString("vi-VN")} VNĐ`);
    set("detail-area", `${post.area} m²`);
    set("detail-rooms", post.rooms);
    set("detail-ward", post.ward || "");
    set("detail-address", post.address || "");
    set("detail-contact-name", post.contactName || "");
    set("detail-phone", post.phone || "");
    set("detail-email", post.email || "");
    set("detail-description", post.description || "");
    set("detail-date", `Đăng ngày: ${post.date || ""}`);

    // images gallery
    const imageDisplay = document.getElementById("detail-images-display");
    const thumbnails = document.getElementById("detail-thumbnails");
    const prev = document.getElementById("prev-btn");
    const next = document.getElementById("next-btn");

    imageDisplay.innerHTML = "";
    thumbnails.innerHTML = "";
    (post.images || ["images/default.jpg"]).forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = post.title;
      img.className = idx === 0 ? "active" : "";
      imageDisplay.appendChild(img);

      const t = document.createElement("img");
      t.src = src;
      t.className = "thumbnail-item" + (idx === 0 ? " active" : "");
      t.dataset.index = idx;
      t.addEventListener("click", () => showImage(Number(t.dataset.index)));
      thumbnails.appendChild(t);
    });

    const mainImages = imageDisplay.querySelectorAll("img");
    const thumbImages = thumbnails.querySelectorAll(".thumbnail-item");
    let currentIndex = 0;

    function showImage(i) {
      if (!mainImages.length) return;
      currentIndex = i;
      mainImages.forEach((img) => img.classList.remove("active"));
      thumbImages.forEach((t) => t.classList.remove("active"));
      mainImages[i].classList.add("active");
      thumbImages[i].classList.add("active");
      thumbImages[i].scrollIntoView({ behavior: "smooth", inline: "center" });
    }

    next &&
      next.addEventListener("click", () =>
        showImage((currentIndex + 1) % mainImages.length)
      );
    prev &&
      prev.addEventListener("click", () =>
        showImage((currentIndex - 1 + mainImages.length) % mainImages.length)
      );
    if (mainImages.length) showImage(0);

    // highlights
    const highlightContainer = document.getElementById("detail-highlights");
    highlightContainer.innerHTML = "";
    (post.highlights || []).forEach((h) => {
      const s = document.createElement("span");
      s.className = "highlight-item";
      s.textContent = h;
      highlightContainer.appendChild(s);
    });
  }

  /* --------------------------
     Page: Admin (admin.html)
     -------------------------- */
  function setupAdminPage() {
    setupNavigation();
    const formWrap = document.getElementById("password-form");
    const panel = document.getElementById("admin-panel");
    const adminTableBody = document.getElementById("admin-table-body");

    function loadPostsToTable() {
      const posts = window.roomsStorage.getPosts();
      if (!adminTableBody) return;
      adminTableBody.innerHTML = "";
      if (!posts.length) {
        adminTableBody.innerHTML =
          '<tr><td colspan="6" class="text-center text-gray-500">Chưa có tin nào.</td></tr>';
        return;
      }
      posts.forEach((p, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${idx + 1}</td>
                        <td><a href="chitiet.html?id=${idx}" class="text-blue-600 hover:underline">${
          p.title
        }</a></td>
                        <td>${Number(p.price).toLocaleString("vi-VN")} VNĐ</td>
                        <td>${p.ward || ""}</td>
                        <td>${p.date || ""}</td>
                        <td><button class="btn-delete" data-idx="${idx}">Xóa</button></td>`;
        adminTableBody.appendChild(tr);
      });

      adminTableBody.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.idx);
          showConfirm("Bạn có chắc muốn xóa?", () => {
            window.roomsStorage.deletePostByIndex(idx);
            loadPostsToTable();
            showAlert("Tin đã được xóa.");
          });
        });
      });
    }

    if (sessionStorage.getItem("adminLoggedIn")) {
      formWrap && formWrap.classList.add("hidden");
      panel && panel.classList.remove("hidden");
      loadPostsToTable();
    } else if (formWrap) {
      formWrap.classList.remove("hidden");
      panel && panel.classList.add("hidden");
      const loginForm = document.getElementById("loginForm");
      loginForm &&
        loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const pass = document.getElementById("password").value;
          // demo only: change in production
          if (pass === "123") {
            sessionStorage.setItem("adminLoggedIn", "true");
            formWrap.classList.add("hidden");
            panel.classList.remove("hidden");
            loadPostsToTable();
          } else {
            showAlert("Mật khẩu không đúng");
            document.getElementById("password").value = "";
          }
        });
    }
  }

  // bootstrap: identify page and init
  document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.split("/").pop();
    // normalize empty (index)
    const page = path === "" ? "index.html" : path;
    if (page === "dangtin.html") setupDangTinPage();
    else if (page === "danhsach.html") setupDanhSachPage();
    else if (page === "chitiet.html") setupChiTietPage();
    else if (page === "admin.html") setupAdminPage();
    else {
      setupNavigation();
    } // index or others
  });

  // export small helpers if needed
  window.__app = {
    showAlert,
    showConfirm,
  };
})();
