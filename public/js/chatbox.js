/* =======================================
   --- FILE: js/chatbox.js ---
   ======================================= */

// Gói tất cả logic vào một hàm để đảm bảo nó chỉ chạy khi được gọi
function initializeChatbox() {
  const chatWidget = document.getElementById("chat-widget");
  if (!chatWidget) return;

  const toggleBtn = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const closeBtn = document.getElementById("chat-close");
  const sendBtn = document.getElementById("send-btn");
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");

  if (!toggleBtn || !chatBox || !closeBtn) {
    console.error("Không tìm thấy các phần tử cơ bản của Chatbox.");
    return;
  }

  // Mở / đóng chat
  toggleBtn.addEventListener("click", () => {
    chatBox.classList.toggle("hidden");
    if (!chatBox.classList.contains("hidden")) {
      chatInput.focus();
    }
  });
  closeBtn.addEventListener("click", () => chatBox.classList.add("hidden"));

  // Gửi tin nhắn
  const sendMessage = () => {
    const msg = chatInput.value.trim();
    if (!msg) return;

    appendMessage(msg, "user");
    chatInput.value = "";

    setTimeout(() => {
      appendMessage(getBotReply(msg), "bot");
    }, 600);
  };

  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Hàm thêm tin nhắn vào giao diện
  const appendMessage = (text, sender) => {
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-message" : "bot-message";
    div.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // Logic trả lời của Bot
  const getBotReply = (msg) => {
    msg = msg.toLowerCase();
    if (msg.includes("đăng tin"))
      return "Để đăng bài, bạn vào <a href='dangtin.html'>Đăng tin</a> nhé!";
    if (msg.includes("admin"))
      return "Khu vực quản trị: <a href='admin.html'>Tại đây</a> 🔐";
    if (msg.includes("phòng") || msg.includes("thuê") || msg.includes("tìm"))
      return "Bạn có thể xem danh sách phòng trong mục 🏠 <a href='danhsach.html'>Danh sách</a>.";
    if (msg.includes("chào")) return "Xin chào bạn! 😊";
    if (msg.includes("cảm ơn")) return "Không có gì ạ, rất vui được giúp bạn!";
    return "Cảm ơn bạn! Hiện tại hệ thống sẽ sớm phản hồi thêm 🌟";
  };

  // Hiển thị tin nhắn chào mừng khi mới vào
  if (chatBody.children.length === 0) {
    appendMessage(
      "Xin chào 👋<br>CHICKY.STU có thể giúp gì cho bạn hôm nay?",
      "bot"
    );
  }
}
