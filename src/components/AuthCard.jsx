import { useState } from "react";

function AuthField({ label, type = "text", value, onChange, helper }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

export default function AuthCard({ onSignIn, onSignUp, feedback }) {
  const [mode, setMode] = useState("signin");
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    companyName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const submitSignIn = (event) => {
    event.preventDefault();
    onSignIn(signInData);
  };

  const submitSignUp = (event) => {
    event.preventDefault();
    onSignUp(signUpData);
  };

  return (
    <section className="panel card">
      <div className="mode-toggle">
        <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>Sign In</button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
      </div>

      {mode === "signin" ? (
        <form onSubmit={submitSignIn} className="form-grid">
          <h2>Secure Access</h2>
          <p>Sign in with your organization account to start Stage 1 profiling.</p>
          <AuthField label="Username" value={signInData.username} onChange={(value) => setSignInData((prev) => ({ ...prev, username: value }))} />
          <AuthField
            label="Password"
            type="password"
            value={signInData.password}
            onChange={(value) => setSignInData((prev) => ({ ...prev, password: value }))}
          />
          <button type="submit" className="primary-btn">Continue</button>
          <small>Sample first-login user: `new_admin` / `Welcome123!`</small>
        </form>
      ) : (
        <form onSubmit={submitSignUp} className="form-grid">
          <h2>Create Account</h2>
          <p>Create your workspace admin account for TISAX readiness assessment.</p>
          <AuthField
            label="Company Name"
            value={signUpData.companyName}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, companyName: value }))}
          />
          <AuthField
            label="Username"
            value={signUpData.username}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, username: value }))}
          />
          <AuthField
            label="Password"
            type="password"
            value={signUpData.password}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, password: value }))}
            helper="Use at least 8 characters."
          />
          <AuthField
            label="Confirm Password"
            type="password"
            value={signUpData.confirmPassword}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, confirmPassword: value }))}
          />
          <button type="submit" className="primary-btn">Create Account</button>
        </form>
      )}

      {feedback ? <p className="feedback">{feedback}</p> : null}
    </section>
  );
}
