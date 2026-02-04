import axios from "axios";

export const getStats = async () => {
  const response = await axios.get("/api/dashboard/stats");
  console.log("Resoopnse: ", response);
  return response;
};

export const getCloudUrls = async () => {
  const response = await axios.get("/api/videos/cloudurls");
  console.log("Resoopnse: ", response);
  return response
};
