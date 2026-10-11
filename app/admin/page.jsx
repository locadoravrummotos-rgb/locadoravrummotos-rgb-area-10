
"use client";

import { useState } from "react";

const SUPABASE_URL = "https://eccsmqkqxyppyqcqabuj.supabase.co";
const SUPABASE_KEY = "sb_publishable_5q20u_yETnBOQnSFh2sDag_MQ-GztsA";

export default function AdminPage() {
  const [email, setEmail] = useState("area10storee@gmail.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error_description || "Erro no login");
      }

      const adminResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/is_area10_admin`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${data.access_token}`,
            "Content-Type": "application/json",
          },
          body: "{}",
        }
      );

      if (!adminResponse.ok || (await adminResponse.json()) !== true) {
        throw new Error("Usuário sem permissão administrativa.");
      }

      setToken(data.access_token);
      setAuthorized(true);
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: 14,
    margin: "10px 0 18px",
    borderRadius: 8,
    border: "1px solid #52654a",
    background: "#182018",
    color: "white",
    fontSize: 16,
  };

  const buttonStyle = {
    background: "#aaff00",
    color: "#101510",
    padding: "14px 22px",
    border: 0,
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080b08",
      color: "white",
      padding: 25,
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>ÁREA <span style={{ color: "#aaff00" }}>10</span></h1>
      <p>PAINEL ADMINISTRATIVO</p>

      {!authorized ? (
        <form onSubmit={login} style={{ maxWidth: 420, marginTop: 40 }}>
          <h2>Acesso do administrador</h2>

          <label>E-mail</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {message && <p role="alert">{message}</p>}
        </form>
      ) : (
        <section style={{ marginTop: 35 }}>
          <h2>Bem-vindo à administração!</h2>
          <p>Seu acesso foi autorizado.</p>
          <p>Próxima etapa: cadastro de produtos e controle de estoque.</p>
          <button
            style={buttonStyle}
            onClick={() => {
              setToken("");
              setAuthorized(false);
            }}
          >
            Sair
          </button>
        </section>
      )}
    </main>
  );
}
