import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import "./login.scss";
import { API_URL } from "../../services/api";
import { Bounce, toast } from "react-toastify";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async ({ username, password }) => {
    try {
      const response = await API_URL.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Welcome back</h1>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          {errors.username && <span>This field is required</span>}
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.username && <span>This field is required</span>}
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
