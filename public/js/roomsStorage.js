(function () {
  const STORAGE_KEY = "roomsData";
  function loadRooms() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }
  function saveRooms(rooms) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  }
  window.getRooms = () => loadRooms();
  window.addRoom = (room) => {
    const rooms = loadRooms();
    room.id = Date.now();
    rooms.push(room);
    saveRooms(rooms);
  };
})();
