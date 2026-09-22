import api from "./API";

const PublicAPI = {
  // About Page
  fetchAboutData: async () => {
    const response = await api.get("/about");
    return response.data;
  },

  getAboutData: async () => {
    const response = await api.get("/about");
    return response.data;
  },

  // Newsletter Subscriptions
  subscribeNewsletter: async (email) => {
    const response = await api.post("/newsletter/subscribe", { email });
    return response.data;
  },

  unsubscribeNewsletter: async (email) => {
    const response = await api.post("/newsletter/unsubscribe", { email });
    return response.data;
  },

  // Contact / Inquiry Form
  submitInquiry: async (inquiryData) => {
    // inquiryData: { name, email, subject, message, inquiryType }
    const response = await api.post("/inquiry", inquiryData);
    return response.data;
  },

  getInquiryTypes: async () => {
    const response = await api.get("/inquiry/options");
    return response.data;
  },

  // Public Blog / Articles
  getPublishedPosts: async () => {
    const response = await api.get("/posts");
    return response.data;
  },

  getPostBySlug: async (slug) => {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },
};

// Named export for backwards-compatibility destructuring: import { fetchAboutData } from ...
export const fetchAboutData = PublicAPI.fetchAboutData;

export default PublicAPI;
