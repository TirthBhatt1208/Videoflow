import axios from "axios";

export const getStats = async () => {
  const response = await axios.get("/api/dashboard/stats");
  console.log("Resoopnse: ", response);
  return response;
};

export const getCloudUrls = async () => {
  const response = await axios.get("/api/videos/cloudurls");
  console.log("Resoopnse: ", response);

  return response;
};

export const getRecentActivity = async () => {
  const response = await axios.get("/api/dashboard/recent");
  return response;
};

export const getProcessingQueue = async () => {
  const response = await axios.get("/api/dashboard/processing");
  return response;
};

export const getAllCompletedVideos = async (page: number = 1, limit: number = 10) => {
  const response = await axios.get(`/api/videos/all-completed?page=${page}&limit=${limit}`);
  return response;
};
