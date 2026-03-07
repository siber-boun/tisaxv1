import { useEffect, useState } from "react";
import "./App.css";
import AuthCard from "./components/AuthCard";
import StageIndicator from "./components/StageIndicator";
import { FormSection, InputField, SelectField, TextAreaField } from "./components/FormSection";
import {
  certificationOptions,
  companySizeOptions,
  industryOptions,
  itEnvironmentOptions,
  maturityOptions,
  yesNoPartialOptions,
} from "./dataOptions";

const USERS_KEY = "tisax_prototype_users";
const SESSION_KEY = "tisax_prototype_session";
const PROFILE_KEY = "tisax_prototype_profile";

const seedUsers = [
  { username: "new_admin", password: "Welcome123!", companyName: "BlueForge Mobility", firstLogin: true },
  { username: "returning_admin", password: "Welcome123!", companyName: "Northway Systems", firstLogin: false },
];

const emptyProfile = {
  companyName: "",
  companySize: "",
  industrySector: "",
  numberOfEmployees: "",
  countryRegion: "",
  officeLocations: "",
  itEnvironment: "",
  thirdPartyProviders: "",
  securityPolicies: "",
  certificationStatus: "",
  regulatoryRequirements: "",
  criticalAssets: "",
  maturityLevel: "",
  mainConcerns: "",
};

const stepConfig = [
  {
    title: "Organization Context",
    description: "Capture company identity and operating footprint.",
    requiredFields: ["companyName", "companySize", "industrySector", "numberOfEmployees", "countryRegion", "officeLocations"],
  },
  {
    title: "Technology and Dependencies",
    description: "Understand IT setup and third-party reliance.",
    requiredFields: ["itEnvironment", "thirdPartyProviders", "criticalAssets"],
  },
  {
    title: "Governance and Compliance",
    description: "Gather policy and certification posture for TISAX alignment.",
    requiredFields: ["securityPolicies", "certificationStatus", "regulatoryRequirements"],
  },
  {
    title: "Risk and Maturity Priorities",
    description: "Identify cybersecurity maturity and immediate concerns.",
    requiredFields: ["maturityLevel", "mainConcerns"],
  },
];

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureUsers() {
  const users = readJson(USERS_KEY, null);
  if (!users) {
    writeJson(USERS_KEY, seedUsers);
    return seedUsers;
  }
  return users;
}

function validateStep(values, requiredFields) {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!String(values[field] ?? "").trim()) errors[field] = "This field is required.";
  });
  return errors;
}

export default function App() {
  const [session, setSession] = useState(() => readJson(SESSION_KEY, null));
  const [screen, setScreen] = useState(() => {
    const active = readJson(SESSION_KEY, null);
    if (!active) return "auth";
    return active.firstLogin ? "onboarding" : "summary";
  });
  const [feedback, setFeedback] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(() => {
    const saved = readJson(PROFILE_KEY, null);
    const active = readJson(SESSION_KEY, null);
    return { ...emptyProfile, ...saved, companyName: saved?.companyName || active?.companyName || "" };
  });

  useEffect(() => {
    ensureUsers();
  }, []);

  const updateField = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }));

  const handleSignUp = (payload) => {
    const users = ensureUsers();

    if (!payload.companyName || !payload.username || payload.password.length < 8) {
      setFeedback("Please fill all fields and use at least 8 characters for password.");
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    if (users.some((user) => user.username.toLowerCase() === payload.username.toLowerCase())) {
      setFeedback("Username already exists.");
      return;
    }

    const nextUsers = [
      ...users,
      {
        username: payload.username,
        password: payload.password,
        companyName: payload.companyName,
        firstLogin: true,
      },
    ];

    writeJson(USERS_KEY, nextUsers);
    setFeedback("Account created. Sign in to continue.");
  };

  const handleSignIn = (payload) => {
    const users = ensureUsers();
    const user = users.find((item) => item.username === payload.username && item.password === payload.password);

    if (!user) {
      setFeedback("Invalid username or password.");
      return;
    }

    writeJson(SESSION_KEY, user);
    setSession(user);
    setFeedback("");
    setProfile((prev) => ({ ...prev, companyName: prev.companyName || user.companyName }));

    if (user.firstLogin) {
      setScreen("onboarding");
      return;
    }

    setScreen("summary");
  };

  const handleSaveAndContinue = () => {
    const current = stepConfig[step - 1];
    const nextErrors = validateStep(profile, current.requiredFields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    writeJson(PROFILE_KEY, profile);
    setFeedback("Progress saved.");

    if (step < stepConfig.length) {
      setStep((prev) => prev + 1);
      return;
    }

    const users = ensureUsers();
    const updatedUsers = users.map((item) =>
      item.username === session.username ? { ...item, firstLogin: false, companyName: profile.companyName } : item,
    );

    const updatedSession = { ...session, firstLogin: false, companyName: profile.companyName };
    writeJson(USERS_KEY, updatedUsers);
    writeJson(SESSION_KEY, updatedSession);
    setSession(updatedSession);
    setScreen("summary");
    setFeedback("Stage 1 completed successfully.");
  };

  const handleBack = () => {
    setErrors({});
    setFeedback("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setScreen("auth");
    setStep(1);
    setErrors({});
    setFeedback("Signed out.");
  };

  const currentTitle = stepConfig[step - 1].title;

  return (
    <main className="app-shell">
      <div className="bg-shape bg-shape-left" />
      <div className="bg-shape bg-shape-right" />

      {screen === "auth" ? (
        <div className="container auth-layout">
          <section className="intro card">
            <p className="kicker">AI-Based TISAX Platform</p>
            <h1>Cybersecurity Assessment Onboarding</h1>
            <p>
              Start with trusted authentication. On first login, you will complete Stage 1 organization profiling so the
              platform can establish your security posture baseline.
            </p>
            <ul>
              <li>Structured TISAX and cybersecurity context intake</li>
              <li>Designed for non-expert users</li>
              <li>Modular flow for future backend integration</li>
            </ul>
          </section>
          <AuthCard onSignIn={handleSignIn} onSignUp={handleSignUp} feedback={feedback} />
        </div>
      ) : null}

      {screen === "onboarding" ? (
        <div className="container onboarding-layout">
          <StageIndicator step={step} total={stepConfig.length} title={currentTitle} />

          {step === 1 ? (
            <FormSection title="Company Profile" description="Tell us who you are and where you operate.">
              <div className="grid two-col">
                <InputField
                  label="Company Name"
                  required
                  helper="Legal or commonly used business name."
                  value={profile.companyName}
                  onChange={(value) => updateField("companyName", value)}
                  error={errors.companyName}
                />
                <SelectField
                  label="Company Size"
                  required
                  helper="Choose a size band for benchmarking."
                  options={companySizeOptions}
                  value={profile.companySize}
                  onChange={(value) => updateField("companySize", value)}
                  error={errors.companySize}
                />
                <SelectField
                  label="Industry Sector"
                  required
                  helper="Used for sector-specific threat patterns."
                  options={industryOptions}
                  value={profile.industrySector}
                  onChange={(value) => updateField("industrySector", value)}
                  error={errors.industrySector}
                />
                <InputField
                  label="Number of Employees"
                  required
                  type="number"
                  helper="Approximate total workforce."
                  value={profile.numberOfEmployees}
                  onChange={(value) => updateField("numberOfEmployees", value)}
                  error={errors.numberOfEmployees}
                />
                <InputField
                  label="Country / Region"
                  required
                  helper="Primary operating geography."
                  value={profile.countryRegion}
                  onChange={(value) => updateField("countryRegion", value)}
                  error={errors.countryRegion}
                />
                <InputField
                  label="Number of Office Locations"
                  required
                  type="number"
                  helper="Include headquarters and branch offices."
                  value={profile.officeLocations}
                  onChange={(value) => updateField("officeLocations", value)}
                  error={errors.officeLocations}
                />
              </div>
            </FormSection>
          ) : null}

          {step === 2 ? (
            <FormSection title="IT Environment and Critical Assets" description="Map technical landscape and external dependencies.">
              <div className="grid two-col">
                <SelectField
                  label="IT Environment"
                  required
                  helper="Primary hosting model."
                  options={itEnvironmentOptions}
                  value={profile.itEnvironment}
                  onChange={(value) => updateField("itEnvironment", value)}
                  error={errors.itEnvironment}
                />
                <SelectField
                  label="Third-Party Providers"
                  required
                  helper="Vendors with access to systems or data."
                  options={yesNoPartialOptions}
                  value={profile.thirdPartyProviders}
                  onChange={(value) => updateField("thirdPartyProviders", value)}
                  error={errors.thirdPartyProviders}
                />
                <TextAreaField
                  label="Critical Assets / Sensitive Data"
                  required
                  helper="Examples: customer PII, source code, production systems, finance records."
                  value={profile.criticalAssets}
                  onChange={(value) => updateField("criticalAssets", value)}
                  error={errors.criticalAssets}
                />
              </div>
            </FormSection>
          ) : null}

          {step === 3 ? (
            <FormSection title="Security Governance and Compliance" description="Understand policy coverage and compliance status.">
              <div className="grid two-col">
                <SelectField
                  label="Security Policies"
                  required
                  helper="Documented information security policies in place?"
                  options={yesNoPartialOptions}
                  value={profile.securityPolicies}
                  onChange={(value) => updateField("securityPolicies", value)}
                  error={errors.securityPolicies}
                />
                <SelectField
                  label="ISO 27001 or Similar Certification"
                  required
                  helper="Current certification posture."
                  options={certificationOptions}
                  value={profile.certificationStatus}
                  onChange={(value) => updateField("certificationStatus", value)}
                  error={errors.certificationStatus}
                />
                <TextAreaField
                  label="Regulatory Requirements"
                  required
                  helper="Examples: GDPR, NIS2, automotive sector obligations."
                  value={profile.regulatoryRequirements}
                  onChange={(value) => updateField("regulatoryRequirements", value)}
                  error={errors.regulatoryRequirements}
                />
              </div>
            </FormSection>
          ) : null}

          {step === 4 ? (
            <FormSection title="Maturity and Priority Risks" description="Capture current cybersecurity maturity and top concerns.">
              <div className="grid two-col">
                <SelectField
                  label="Current Cybersecurity Maturity Level"
                  required
                  helper="Choose the closest maturity stage."
                  options={maturityOptions}
                  value={profile.maturityLevel}
                  onChange={(value) => updateField("maturityLevel", value)}
                  error={errors.maturityLevel}
                />
                <TextAreaField
                  label="Main Cybersecurity Concerns"
                  required
                  helper="Example: ransomware risk, IAM gaps, supplier risk, incident readiness."
                  value={profile.mainConcerns}
                  onChange={(value) => updateField("mainConcerns", value)}
                  error={errors.mainConcerns}
                />
              </div>
            </FormSection>
          ) : null}

          <div className="actions">
            <button className="ghost-btn" onClick={handleSignOut}>
              Sign Out
            </button>
            <div>
              {step > 1 ? (
                <button className="ghost-btn" onClick={handleBack}>
                  Back
                </button>
              ) : null}
              <button className="primary-btn" onClick={handleSaveAndContinue}>
                Save and Continue
              </button>
            </div>
          </div>
          {feedback ? <p className="feedback success">{feedback}</p> : null}
        </div>
      ) : null}

      {screen === "summary" ? (
        <div className="container summary-layout">
          <section className="card summary-card">
            <p className="kicker">Stage 1 Complete</p>
            <h2>{session?.companyName || "Organization"} profile is saved</h2>
            <p>
              First-login onboarding is complete. In the next stage, the platform can generate an AI-driven cybersecurity
              and TISAX readiness baseline.
            </p>
            <button className="primary-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </section>
        </div>
      ) : null}
    </main>
  );
}
