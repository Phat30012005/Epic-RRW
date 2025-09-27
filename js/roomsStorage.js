(function () {
  const STORAGE_KEY = "rooms";

  // Mẫu dữ liệu khởi tạo lần đầu
  const sampleRooms = [
    {
      id: 1,
      name: "Phòng trọ giá rẻ Ninh Kiều",
      type: "Ghép",
      price: 1800000,
      address: "123 ABCD",
      images: images = ["images/room1.jpg"] ,
      description: "Phòng rộng rãi, gần trung tâm, an ninh tốt.",
      hot: true,
    },
    {
      id: 2,
      name: "Căn hộ mini Bình Thủy",
      type: "Căn hộ",
      price: 4500000,
      address: "123 ABC",
      images: ["images/room2.jpg"],
      description: "Căn hộ đầy đủ tiện nghi, cho gia đình.",
      hot: false,
    },
    {
      id: 3,
      name: "Phòng đơn Bình Thủy",
      type: "Đơn",
      price: 1500000,
      address: "123 ABC",
      images: ["images/room2.jpg"],
      description: "Phòng đơn đầy đủ tiện nghi",
      hot: false,
    },
    {
      id: 4,
      name: "Phòng trọ sinh viên Cần Thơ",
      type: "Ghép",
      price: 1800000,
      address: "123 ABC",
      images: ["images/room3.jpg"],
      description: "Phòng sạch sẽ, gần ĐHCT, giá hợp lý.",
      hot: false,
    },
  ];

  // Lấy từ localStorage
  function getRooms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  // Lưu vào localStorage
  function saveRooms(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Hàm lọc phòng
  function filterRooms({ type = "", minPrice = 0, maxPrice = Infinity } = {}) {
    return getRooms().filter((room) => {
      const matchType = type ? room.type === type : true;
      const matchPrice = room.price >= minPrice && room.price <= maxPrice;
      return matchType && matchPrice;
    });
  }

  // Khởi tạo sampleRooms nếu chưa có key
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveRooms(sampleRooms);
  }

  // Xuất ra ngoài để file khác dùng
  window.getRooms = getRooms;
  window.saveRooms = saveRooms;
  window.filterRooms = filterRooms;
})();
