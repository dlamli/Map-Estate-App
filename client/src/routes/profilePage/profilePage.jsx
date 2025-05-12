import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import { API_URL } from "../../services/api";
import "./profilePage.scss";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Suspense } from "react";

function ProfilePage() {
  const data = useLoaderData();
  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API_URL.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={user.userInfo.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{user.userInfo.username}</b>
            </span>
            <span>
              E-mail: <b>{user.userInfo.email}</b>
            </span>
            {user && <button onClick={handleLogout}>Logout</button>}
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading post</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading post</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading chats...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElemen={<p>Error loading chats</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
