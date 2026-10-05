import React, { useRef, useState } from "react";
import "../css/Login.css";
import { API_URL } from "../config/api";
import logoWesthoff from "../assets/logo_Westhoff.jpg";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    role: "OWNER" | "DAPUR" | "TOKO";
  };
}

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showPassword, setShowPassword] =
    useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  const passwordRef =
    useRef<HTMLInputElement>(null);

  const handleUsernameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!username.trim()) {
        setError("Username wajib diisi.");
        return;
      }

      setError("");
      passwordRef.current?.focus();
    }
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError(
        "Username dan password wajib diisi."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data: LoginResponse =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Username atau password salah."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.user.role === "DAPUR") {
        window.location.href =
          "/dashboard-dapur";
      } else if (data.user.role === "TOKO") {
        window.location.href =
          "/dashboard-toko";
      } else if (data.user.role === "OWNER") {
        window.location.href =
          "/dashboard-owner";
      }
    } catch (error) {
      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <img
            src={logoWesthoff}
            alt="Westhoff Logo"
          />
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>

          <p>
            Silahkan login terlebih dahulu
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                👤
              </span>

              <input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setUsername(e.target.value)
                }
                onKeyDown={handleUsernameKeyDown}
                autoComplete="username"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                🔒
              </span>

              <input
                ref={passwordRef}
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Masukkan password"
                value={password}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>
                ) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={loading}
              >
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span>
            Westhoff
          </span>

          <span>
            Bakery Management System
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;