import api from "./API";

const AdminAPI = {
  // Admin Auth
  login: async (credentials) => {
    const response = await api.post("/admin/login", credentials);
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
  },

  // About Section Management
  updateAboutData: async (aboutData) => {
    const response = await api.put("/about", aboutData);
    return response.data;
  },

  // Inquiry Management
  getAllInquiries: async () => {
    const response = await api.get("/inquiry");
    return response.data;
  },

  updateInquiryStatus: async (id, status) => {
    const response = await api.patch(`/inquiry/${id}/status`, { status });
    return response.data;
  },

  replyToInquiry: async (inquiryId, replyText) => {
    const response = await api.post(`/inquiry/${inquiryId}/reply`, {
      replyText,
    });
    return response.data;
  },

  deleteInquiry: async (inquiryId) => {
    const response = await api.delete(`/inquiry/${inquiryId}`);
    return response.data;
  },

  // Inquiry Types / Dropdown Settings
  getInquiryTypes: async () => {
    const response = await api.get("/inquiry/types");
    return response.data;
  },

  addInquiryType: async (name) => {
    const response = await api.post("/inquiry/types", { name });
    return response.data;
  },

  deleteInquiryType: async (id) => {
    const response = await api.delete(`/inquiry/types/${id}`);
    return response.data;
  },

  // Newsletter Subscriber Management
  getSubscribers: async () => {
    const response = await api.get("/newsletter/subscribers");
    return response.data;
  },

  deleteSubscriber: async (subscriberId) => {
    const response = await api.delete(
      `/newsletter/subscribers/${subscriberId}`,
    );
    return response.data;
  },

  // Article & Broadcast Management
  createPost: async (postData) => {
    const response = await api.post("/admin/posts", postData);
    return response.data;
  },

  updatePost: async (postId, postData) => {
    const response = await api.put(`/admin/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/admin/posts/${postId}`);
    return response.data;
  },

  broadcastNewPost: async (broadcastData) => {
    // broadcastData: { postTitle, postSnippet, postUrl }
    const response = await api.post("/admin/broadcast", broadcastData);
    return response.data;
  },
};

export default AdminAPI;
