/* =======================================
   --- FILE: js/main.js ---
   ======================================= */
document.addEventListener("DOMContentLoaded", function () {
  // Hàm này dùng để tải một file HTML vào một vị trí trên trang
  const loadComponent = (url, placeholderId) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Không thể tải ${url}`);
        return response.text();
      })
      .then((data) => {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
          placeholder.outerHTML = data; // Thay thế placeholder bằng nội dung component
        }
      })
      .catch((error) => console.error(`Lỗi tải component: ${error}`));
  };

  // Tải Header và Footer
  loadComponent("header.html", "header-placeholder");
  loadComponent("footer.html", "footer-placeholder");

  // Tải và kích hoạt Chatbox
  fetch("chatbox.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      // Hàm initializeChatbox() được định nghĩa trong file chatbox.js
      if (typeof initializeChatbox === "function") {
        initializeChatbox();
      }
    });
});
