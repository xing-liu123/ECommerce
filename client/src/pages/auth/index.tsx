import { SyntheticEvent, useState, useContext } from "react";
import { UserErrors } from "../../errors";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { ShopContext, IShopContext } from "../../context/shopContext";

export const AuthPage = () => {
  return (
    <div className="auth">
      <Register />
      <Login />
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3001/user/register", {
        username,
        password,
      });

      alert("Registration completed!");
    } catch (err) {
      if (err.response.data.type === UserErrors.USERNAME_ALREADY_EXISTS) {
        alert("Error: Username already in use.");
      } else {
        alert("Error: Somthing went wrong.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="register_username">Username:</label>
          <input
            type="text"
            id="register_username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register_password">Password:</label>
          <input
            type="text"
            id="register_password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" disabled={!username || !password}>
          Register
        </button>
      </form>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setIsAuthenticated } = useContext<IShopContext>(ShopContext);
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      localStorage.setItem("userID", result.data.userID);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      let errorMessage: string = "";

      switch (err.response.data.type) {
        case UserErrors.NO_USER_FOUND:
          errorMessage = "User doesn't exist";
          break;
        case UserErrors.WRONG_CREDENTIALS:
          errorMessage = "Wrong username or password";
          break;
        default:
          errorMessage = "Something went wrong.";
      }

      alert("Error: " + errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="login_username">Username:</label>
          <input
            type="text"
            id="login_username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login_password">Password:</label>
          <input
            type="text"
            id="login_password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" disabled={!username || !password}>
          Login
        </button>
      </form>
    </div>
  );
};
