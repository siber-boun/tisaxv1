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

export default function AuthCard({ onSignIn, onSignUp, feedback, text }) {
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
        <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>{text.signInTab}</button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>{text.signUpTab}</button>
      </div>

      {mode === "signin" ? (
        <form onSubmit={submitSignIn} className="form-grid">
          <h2>{text.secureAccess}</h2>
          <p>{text.signInDesc}</p>
          <AuthField label={text.username} value={signInData.username} onChange={(value) => setSignInData((prev) => ({ ...prev, username: value }))} />
          <AuthField
            label={text.password}
            type="password"
            value={signInData.password}
            onChange={(value) => setSignInData((prev) => ({ ...prev, password: value }))}
          />
          <button type="submit" className="primary-btn">{text.continue}</button>
          <small>{text.sampleUser}</small>
        </form>
      ) : (
        <form onSubmit={submitSignUp} className="form-grid">
          <h2>{text.createAccount}</h2>
          <p>{text.signUpDesc}</p>
          <AuthField
            label={text.companyName}
            value={signUpData.companyName}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, companyName: value }))}
          />
          <AuthField
            label={text.username}
            value={signUpData.username}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, username: value }))}
          />
          <AuthField
            label={text.password}
            type="password"
            value={signUpData.password}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, password: value }))}
            helper={text.minPassword}
          />
          <AuthField
            label={text.confirmPassword}
            type="password"
            value={signUpData.confirmPassword}
            onChange={(value) => setSignUpData((prev) => ({ ...prev, confirmPassword: value }))}
          />
          <button type="submit" className="primary-btn">{text.createAccountBtn}</button>
        </form>
      )}

      {feedback ? <p className="feedback">{feedback}</p> : null}
    </section>
  );
}
