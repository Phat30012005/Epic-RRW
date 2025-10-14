document.addEventListener("DOMContentLoaded", () => {
  const chatWidget = document.getElementById("chat-widget");
  const chatBox = document.getElementById("chat-box");
  const chatToggle = document.getElementById("chat-toggle");
  const closeChat = document.getElementById("close-chat");
  const chatbox = document.getElementById("chatbox");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const clearBtn = document.getElementById("clear-chat");
  const toggleSaveBtn = document.getElementById("toggle-save");

  let saveEnabled = false; // Mặc định KHÔNG lưu lịch sử

  // --- Hiển thị / Ẩn chatbox ---
  chatToggle.addEventListener("click", () => {
    chatBox.classList.remove("hidden");
    chatBox.classList.add("show");
    chatToggle.classList.add("hidden");
  });

  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("show");
    chatBox.classList.add("hidden");
    chatToggle.classList.remove("hidden");
  });

  // --- Kiểm tra lưu lịch sử ---
  if (localStorage.getItem("chatSaveEnabled") === "true") {
    saveEnabled = true;
    toggleSaveBtn.textContent = "💾 Lưu ON";
    const saved = localStorage.getItem("chatHistory");
    if (saved) chatbox.innerHTML = saved;
  } else {
    localStorage.removeItem("chatHistory");
  }

  // --- Gửi tin nhắn ---
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = "message user";
    msgDiv.textContent = text;
    chatbox.appendChild(msgDiv);
    chatInput.value = "";
    chatbox.scrollTop = chatbox.scrollHeight;

    saveHistory();

    // Giả lập phản hồi bot
    setTimeout(() => {
      const reply = document.createElement("div");
      reply.className = "message bot";
      reply.textContent = getBotReply(text);
      chatbox.appendChild(reply);
      chatbox.scrollTop = chatbox.scrollHeight;
      saveHistory();
    }, 700);
  }

  // --- Hàm phản hồi tự động ---
  function getBotReply(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes("chào")) return "Chào bạn 👋! Mình là trợ lý Chicky.";
    if (lower.includes("giá"))
      return "Phòng hiện có giá từ 1.2tr đến 3.5tr/tháng 💰";
    if (lower.includes("liên hệ"))
      return "Bạn có thể gọi 📞 0909 888 777 hoặc nhắn tin qua Zalo nhé!";
    if (lower.includes("vị trí"))
      return "Hiện có trọ ở trung tâm Cần Thơ và gần Đại học Cần Thơ 📍";
    if (lower.includes("tạm biệt") || lower.includes("bye"))
      return "Tạm biệt bạn 👋! Hẹn gặp lại nhé!";
    return "Mình chưa hiểu rõ 😅. Bạn có thể hỏi về giá, vị trí hoặc liên hệ nhé!";
  }

  // --- Lưu hoặc xóa lịch sử ---
  function saveHistory() {
    if (saveEnabled) localStorage.setItem("chatHistory", chatbox.innerHTML);
  }

  // --- Xóa toàn bộ chat ---
  clearBtn.addEventListener("click", () => {
    chatbox.innerHTML = "";
    localStorage.removeItem("chatHistory");
  });

  // --- Bật / tắt lưu ---
  toggleSaveBtn.addEventListener("click", () => {
    saveEnabled = !saveEnabled;
    toggleSaveBtn.textContent = saveEnabled ? "💾 Lưu ON" : "💾 Lưu OFF";
    localStorage.setItem("chatSaveEnabled", saveEnabled);
    if (!saveEnabled) localStorage.removeItem("chatHistory");
  });

  // --- Sự kiện gửi tin ---
  sendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
