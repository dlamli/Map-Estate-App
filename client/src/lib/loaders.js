import { defer } from "react-router-dom";
import { API_URL } from "../services/api";

export const singlePageLoader = async ({ request, params }) => {
  const res = await API_URL.get(`/posts/${params.id}`);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = API_URL.get(`/posts?${query}`);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = API_URL.get("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};
