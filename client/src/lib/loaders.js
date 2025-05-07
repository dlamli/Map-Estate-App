import { API_URL } from "../services/api";

export const singlePageLoader = async ({ request, params }) => {
  const res = await API_URL.get(`/posts/${params.id}`);
  return res.data;
};
