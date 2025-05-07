import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import "./profileUpdatePage.scss";
import { API_URL } from "../../services/api";
import { useState } from "react";
import UploadWidget from "../../components/upload-widget/upload-widget";

function ProfileUpdatePage() {
  const [error, setError] = useState(null);
  const { user, updateUser } = useAuthContext();
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ username, email, password }) => {
    try {
      const response = await API_URL.put(`/users/${user.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      updateUser(response.data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              defaultValue={user.username}
              {...register("username", { required: true })}
            />
            {errors.username && <span>This field is required</span>}
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              {...register("email", { required: true })}
            />
            {errors.email && <span>This field is required</span>}
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || user.avatar || "/noavatar.jpg"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "dwtwuuy5u",
            uploadPreset: "map-estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
