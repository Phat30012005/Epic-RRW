// roomsStorage.js
(function () {
  const POSTS_KEY = "posts";

  const samplePosts = [
    {
      id: Date.now() - 1000000,
      title: "Phòng trọ giá rẻ Ninh Kiều",
      motelName: "Phòng trọ Ninh Kiều",
      type: "Ghép",
      price: 1800000,
      area: 18,
      rooms: 1,
      ward: "An Cư (Ninh Kiều)",
      address: "123 ABCD",
      images: ["images/room1.jpg"],
      description: "Phòng rộng rãi, gần trung tâm thành phố, an ninh tốt.",
      highlights: ["Có điều hoà", "Giờ giấc tự do"],
      contactName: "Chủ trọ A",
      phone: "0900000001",
      email: "owner1@example.com",
      date: new Date().toLocaleDateString("vi-VN"),
    },
    {
      id: Date.now() - 900000,
      title: "Căn hộ mini Bình Thủy",
      motelName: "Mini Bình Thủy",
      type: "Căn hộ",
      price: 4500000,
      area: 35,
      rooms: 1,
      ward: "Bình Thủy (Bình Thủy)",
      address: "456 DEF",
      images: ["images/room2.jpg"],
      description: "Căn hộ đầy đủ tiện nghi, cho gia đình.",
      highlights: ["Tủ lạnh", "Có máy giặt"],
      contactName: "Chủ trọ B",
      phone: "0900000002",
      email: "owner2@example.com",
      date: new Date().toLocaleDateString("vi-VN"),
    },
  ];

  function getPosts() {
    return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function addPost(post) {
    const posts = getPosts();
    const newPost = Object.assign({}, post);
    newPost.id = Date.now();
    // ensure images array
    newPost.images = Array.isArray(newPost.images)
      ? newPost.images
      : newPost.images
      ? [newPost.images]
      : [];
    posts.push(newPost);
    savePosts(posts);
    return newPost;
  }

  function deletePostByIndex(index) {
    const posts = getPosts();
    if (index >= 0 && index < posts.length) {
      posts.splice(index, 1);
      savePosts(posts);
    }
  }

  // init sample if empty
  if (!localStorage.getItem(POSTS_KEY)) {
    savePosts(samplePosts);
  }

  // export to window
  window.roomsStorage = {
    getPosts,
    savePosts,
    addPost,
    deletePostByIndex,
  };
})();
