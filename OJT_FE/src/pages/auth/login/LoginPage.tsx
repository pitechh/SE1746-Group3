import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import Swal from "sweetalert2";
import { Account } from "../../../types/DataTypes";
import { Role } from "../../../types/StatusEnum";
import logo from "/FPT_University_logo.webp";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      if (response.data) {
        AuthService.setToken(response.data);
        const user: Account | null = AuthService.getUserInfo();
        Swal.fire({ icon: "success", title: "Success", text: "Login successful" });
        if (user && user.role === Role.STUDENT) {
          navigate("/");
        } else {
          navigate("/manager/welcome");
        }

      } else {
        Swal.fire({ icon: "error", title: "Error", text: "Invalid credentials" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Login failed" });
    }
  };

  return (

    <div className="row w-100 mx-0">
      <div className="col-lg-4 mx-auto">
        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
          <div className="brand-logo">
            <img src={logo} alt="logo" />
          </div>
          <h4>Hello! let's get started</h4>
          <h6 className="font-weight-light">Sign in to continue.</h6>
          <form className="pt-3" onSubmit={handleLogin}>
            <div className="form-group">
              <input type="text" className="form-control form-control-lg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="password" className="form-control form-control-lg" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">SIGN IN</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;