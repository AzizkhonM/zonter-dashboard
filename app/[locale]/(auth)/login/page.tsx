// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import "../../globals.css";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       router.push("/");
//     } else {
//       const data = await res.json();
//       setError(data.error || "Something went wrong");
//     }
//   }

//   return (
//     <div className="form-container">
//       <h1 className="form-title">Log In</h1>
//       <p className="form-subtitle">Welcome back! Please enter your details</p>

//       <form onSubmit={handleLogin} className="form">
//         <div className="field">
//           <input
//             className="input"
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="field field-icon">
//           <input
//             className="input"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="button"
//             className="eye-btn"
//             onClick={() => setShowPassword((v) => !v)}
//             tabIndex={-1}
//           >
//             {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//           </button>
//         </div>

//         {error && <p className="error-msg">{error}</p>}

//         <button type="submit" className="submit-btn">
//           Log In
//         </button>
//       </form>

//       <p className="login-link">
//         Don&apos;t have an account? <a href="/register">Register</a>
//       </p>

//       <style>{`
//         .form-container {
//           width: 100%;
//           max-width: 400px;
//         }

//         .form-title {
//           font-size: 2rem;
//           font-weight: 700;
//           color: var(--text-white);
//           margin-bottom: 6px;
//           letter-spacing: -0.5px;
//         }

//         .form-subtitle {
//           font-size: 0.9rem;
//           color: var(--text-muted);
//           margin-bottom: 28px;
//         }

//         .form {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .field {
//           position: relative;
//         }

//         .field-icon .input {
//           padding-right: 44px;
//         }

//         .input {
//           width: 100%;
//           padding: 13px 16px;
//           background: var(--input-bg);
//           border: 1.5px solid var(--input-border);
//           border-radius: var(--radius);
//           font-size: 0.92rem;
//           color: var(--text-primary);
//           outline: none;
//           transition: border-color 0.2s, background 0.2s;
//         }

//         .input::placeholder {
//           color: var(--text-muted);
//         }

//         .input:focus {
//           border-color: var(--input-focus);
//           background: var(--surface);
//         }

//         .eye-btn {
//           position: absolute;
//           right: 14px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: var(--text-muted);
//           display: flex;
//           align-items: center;
//           padding: 0;
//           transition: color 0.2s;
//         }

//         .eye-btn:hover {
//           color: var(--text-secondary);
//         }

//         .error-msg {
//           font-size: 0.82rem;
//           color: var(--error);
//           padding: 0 2px;
//         }

//         .submit-btn {
//           width: 100%;
//           padding: 14px;
//           background: var(--primary);
//           color: #fff;
//           font-size: 0.95rem;
//           font-weight: 600;
//           border: none;
//           border-radius: var(--radius);
//           cursor: pointer;
//           margin-top: 4px;
//           transition: background 0.2s, transform 0.1s;
//         }

//         .submit-btn:hover {
//           background: var(--primary-hover);
//         }

//         .submit-btn:active {
//           transform: scale(0.98);
//         }

//         .login-link {
//           margin-top: 22px;
//           text-align: center;
//           font-size: 0.875rem;
//           color: var(--text-muted);
//         }

//         .login-link a {
//           color: var(--primary);
//           font-weight: 600;
//           text-decoration: none;
//           transition: color 0.2s;
//         }

//         .login-link a:hover {
//           color: var(--primary-hover);
//           text-decoration: underline;
//         }
//       `}</style>
//     </div>
//   );
// }

// function EyeIcon() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   );
// }

// function EyeOffIcon() {
//   return (
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
//       <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
//       <line x1="1" y1="1" x2="23" y2="23" />
//     </svg>
//   );
// }

import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return <AuthForm type="login" />;
}