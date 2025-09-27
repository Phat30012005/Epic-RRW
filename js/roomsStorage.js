(function () {
  const SAMPLE_KEY = "sampleRooms";
  const USER_KEY = "userRooms";

  const sampleRooms = [
    {
      id: 1,
      name: "Phòng trọ giá rẻ Ninh Kiều",
      type: "Ghép",
      price: 1800000,
      address: "123 ABCD",
      images: ["images/room1.jpg"],
      description: "Phòng rộng rãi, gần trung tâm thành phố, an ninh tốt.",
      hot: true,
      rating: 4,
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
      rating: 5,
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
      rating: 3,
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
      rating: 4,
    },
  ];

  function getSampleRooms() {
    return JSON.parse(localStorage.getItem(SAMPLE_KEY) || "[]");
  }

  function getUserRooms() {
    return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  }

  function getRooms() {
    return [...getSampleRooms(), ...getUserRooms()];
  }

  function saveUserRooms(data) {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
  }

  function addRoom(room) {
    const rooms = getUserRooms();
    room.id = Date.now();
    room.images = Array.isArray(room.images) ? room.images : [room.images];
    rooms.push(room);
    saveUserRooms(rooms);
  }

  if (!localStorage.getItem(SAMPLE_KEY)) {
    localStorage.setItem(SAMPLE_KEY, JSON.stringify(sampleRooms));
  }

  window.getRooms = getRooms;
  window.addRoom = addRoom;
})();
