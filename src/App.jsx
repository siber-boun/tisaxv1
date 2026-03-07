import { useEffect, useState } from "react";
import "./App.css";
import AuthCard from "./components/AuthCard";
import StageIndicator from "./components/StageIndicator";
import { FormSection, InputField, SelectField, TextAreaField } from "./components/FormSection";
import AssessmentSectionCard from "./components/AssessmentSectionCard";
import ScoreDashboard from "./components/ScoreDashboard";
import {
  certificationOptions,
  companySizeOptions,
  industryOptions,
  itEnvironmentOptions,
  maturityOptions,
  yesNoPartialOptions,
} from "./dataOptions";
import { computeAssessmentResults, validateSectionQuestions } from "./assessmentUtils";
import { stage2Sections } from "./stage2Data";

const USERS_KEY = "tisax_prototype_users";
const SESSION_KEY = "tisax_prototype_session";
const PROFILE_KEY = "tisax_prototype_profile";
const STAGE2_ANSWERS_KEY = "tisax_prototype_stage2_answers";
const STAGE2_RESULTS_KEY = "tisax_prototype_stage2_results";

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

const stage1Config = [
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

function getScreenForSession(activeSession) {
  if (!activeSession) return "auth";
  if (activeSession.firstLogin) return "onboarding";

  const cachedResults = readJson(STAGE2_RESULTS_KEY, null);
  return cachedResults ? "stage2Results" : "stage2Assessment";
}

export default function App() {
  const [session, setSession] = useState(() => readJson(SESSION_KEY, null));
  const [screen, setScreen] = useState(() => getScreenForSession(readJson(SESSION_KEY, null)));
  const [feedback, setFeedback] = useState("");

  const [stage1Step, setStage1Step] = useState(1);
  const [stage1Errors, setStage1Errors] = useState({});
  const [profile, setProfile] = useState(() => {
    const saved = readJson(PROFILE_KEY, null);
    const active = readJson(SESSION_KEY, null);
    return { ...emptyProfile, ...saved, companyName: saved?.companyName || active?.companyName || "" };
  });

  const [stage2Step, setStage2Step] = useState(1);
  const [stage2Errors, setStage2Errors] = useState({});
  const [stage2Answers, setStage2Answers] = useState(() => readJson(STAGE2_ANSWERS_KEY, {}));
  const [stage2Results, setStage2Results] = useState(() => readJson(STAGE2_RESULTS_KEY, null));

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
    setStage1Step(1);
    setStage2Step(1);
    setStage1Errors({});
    setStage2Errors({});
    setProfile((prev) => ({ ...prev, companyName: prev.companyName || user.companyName }));
    setScreen(getScreenForSession(user));
  };

  const handleStage1Save = () => {
    const current = stage1Config[stage1Step - 1];
    const nextErrors = validateStep(profile, current.requiredFields);
    setStage1Errors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    writeJson(PROFILE_KEY, profile);
    setFeedback("Stage 1 progress saved.");

    if (stage1Step < stage1Config.length) {
      setStage1Step((prev) => prev + 1);
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
    setScreen("stage2Assessment");
    setFeedback("Stage 1 completed. Continue with Stage 2 cybersecurity readiness assessment.");
    setStage1Step(1);
  };

  const handleStage1Back = () => {
    setStage1Errors({});
    setFeedback("");
    setStage1Step((prev) => Math.max(1, prev - 1));
  };

  const handleAnswer = (questionId, value) => {
    setStage2Answers((prev) => {
      const next = { ...prev, [questionId]: value };
      writeJson(STAGE2_ANSWERS_KEY, next);
      return next;
    });

    setStage2Errors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleStage2Save = () => {
    const currentSection = stage2Sections[stage2Step - 1];
    const nextErrors = validateSectionQuestions(currentSection, stage2Answers);
    setStage2Errors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback("Please answer all questions in this section.");
      return;
    }

    setFeedback("Stage 2 progress saved.");

    if (stage2Step < stage2Sections.length) {
      setStage2Step((prev) => prev + 1);
      return;
    }

    const results = computeAssessmentResults(stage2Sections, stage2Answers);
    writeJson(STAGE2_RESULTS_KEY, results);
    setStage2Results(results);
    setScreen("stage2Results");
    setFeedback("Stage 2 assessment completed.");
  };

  const handleStage2Back = () => {
    setFeedback("");
    setStage2Errors({});
    setStage2Step((prev) => Math.max(1, prev - 1));
  };

  const handleRetakeAssessment = () => {
    localStorage.removeItem(STAGE2_ANSWERS_KEY);
    localStorage.removeItem(STAGE2_RESULTS_KEY);
    setStage2Answers({});
    setStage2Results(null);
    setStage2Errors({});
    setStage2Step(1);
    setFeedback("Stage 2 reset. You can run the assessment again.");
    setScreen("stage2Assessment");
  };

  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setScreen("auth");
    setStage1Step(1);
    setStage2Step(1);
    setStage1Errors({});
    setStage2Errors({});
    setFeedback("Signed out.");
  };

  const currentStage1Title = stage1Config[stage1Step - 1].title;
  const currentStage2 = stage2Sections[stage2Step - 1];

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
              Start with trusted authentication. On first login, complete Stage 1 profiling and then Stage 2 readiness
              assessment to identify priority gaps.
            </p>
            <ul>
              <li>Structured TISAX and cybersecurity intake</li>
              <li>Maturity-based controls assessment</li>
              <li>Clear score output and action-oriented recommendations</li>
            </ul>
          </section>
          <AuthCard onSignIn={handleSignIn} onSignUp={handleSignUp} feedback={feedback} />
        </div>
      ) : null}

      {screen === "onboarding" ? (
        <div className="container onboarding-layout">
          <StageIndicator step={stage1Step} total={stage1Config.length} title={currentStage1Title} stageLabel="Stage 1" />

          {stage1Step === 1 ? (
            <FormSection title="Company Profile" description="Tell us who you are and where you operate.">
              <div className="grid two-col">
                <InputField
                  label="Company Name"
                  required
                  helper="Legal or commonly used business name."
                  value={profile.companyName}
                  onChange={(value) => updateField("companyName", value)}
                  error={stage1Errors.companyName}
                />
                <SelectField
                  label="Company Size"
                  required
                  helper="Choose a size band for benchmarking."
                  options={companySizeOptions}
                  value={profile.companySize}
                  onChange={(value) => updateField("companySize", value)}
                  error={stage1Errors.companySize}
                />
                <SelectField
                  label="Industry Sector"
                  required
                  helper="Used for sector-specific threat patterns."
                  options={industryOptions}
                  value={profile.industrySector}
                  onChange={(value) => updateField("industrySector", value)}
                  error={stage1Errors.industrySector}
                />
                <InputField
                  label="Number of Employees"
                  required
                  type="number"
                  helper="Approximate total workforce."
                  value={profile.numberOfEmployees}
                  onChange={(value) => updateField("numberOfEmployees", value)}
                  error={stage1Errors.numberOfEmployees}
                />
                <InputField
                  label="Country / Region"
                  required
                  helper="Primary operating geography."
                  value={profile.countryRegion}
                  onChange={(value) => updateField("countryRegion", value)}
                  error={stage1Errors.countryRegion}
                />
                <InputField
                  label="Number of Office Locations"
                  required
                  type="number"
                  helper="Include headquarters and branch offices."
                  value={profile.officeLocations}
                  onChange={(value) => updateField("officeLocations", value)}
                  error={stage1Errors.officeLocations}
                />
              </div>
            </FormSection>
          ) : null}

          {stage1Step === 2 ? (
            <FormSection title="IT Environment and Critical Assets" description="Map technical landscape and external dependencies.">
              <div className="grid two-col">
                <SelectField
                  label="IT Environment"
                  required
                  helper="Primary hosting model."
                  options={itEnvironmentOptions}
                  value={profile.itEnvironment}
                  onChange={(value) => updateField("itEnvironment", value)}
                  error={stage1Errors.itEnvironment}
                />
                <SelectField
                  label="Third-Party Providers"
                  required
                  helper="Vendors with access to systems or data."
                  options={yesNoPartialOptions}
                  value={profile.thirdPartyProviders}
                  onChange={(value) => updateField("thirdPartyProviders", value)}
                  error={stage1Errors.thirdPartyProviders}
                />
                <TextAreaField
                  label="Critical Assets / Sensitive Data"
                  required
                  helper="Examples: customer PII, source code, production systems, finance records."
                  value={profile.criticalAssets}
                  onChange={(value) => updateField("criticalAssets", value)}
                  error={stage1Errors.criticalAssets}
                />
              </div>
            </FormSection>
          ) : null}

          {stage1Step === 3 ? (
            <FormSection title="Security Governance and Compliance" description="Understand policy coverage and compliance status.">
              <div className="grid two-col">
                <SelectField
                  label="Security Policies"
                  required
                  helper="Documented information security policies in place?"
                  options={yesNoPartialOptions}
                  value={profile.securityPolicies}
                  onChange={(value) => updateField("securityPolicies", value)}
                  error={stage1Errors.securityPolicies}
                />
                <SelectField
                  label="ISO 27001 or Similar Certification"
                  required
                  helper="Current certification posture."
                  options={certificationOptions}
                  value={profile.certificationStatus}
                  onChange={(value) => updateField("certificationStatus", value)}
                  error={stage1Errors.certificationStatus}
                />
                <TextAreaField
                  label="Regulatory Requirements"
                  required
                  helper="Examples: GDPR, NIS2, automotive sector obligations."
                  value={profile.regulatoryRequirements}
                  onChange={(value) => updateField("regulatoryRequirements", value)}
                  error={stage1Errors.regulatoryRequirements}
                />
              </div>
            </FormSection>
          ) : null}

          {stage1Step === 4 ? (
            <FormSection title="Maturity and Priority Risks" description="Capture current cybersecurity maturity and top concerns.">
              <div className="grid two-col">
                <SelectField
                  label="Current Cybersecurity Maturity Level"
                  required
                  helper="Choose the closest maturity stage."
                  options={maturityOptions}
                  value={profile.maturityLevel}
                  onChange={(value) => updateField("maturityLevel", value)}
                  error={stage1Errors.maturityLevel}
                />
                <TextAreaField
                  label="Main Cybersecurity Concerns"
                  required
                  helper="Example: ransomware risk, IAM gaps, supplier risk, incident readiness."
                  value={profile.mainConcerns}
                  onChange={(value) => updateField("mainConcerns", value)}
                  error={stage1Errors.mainConcerns}
                />
              </div>
            </FormSection>
          ) : null}

          <div className="actions">
            <button className="ghost-btn" onClick={handleSignOut}>
              Sign Out
            </button>
            <div>
              {stage1Step > 1 ? (
                <button className="ghost-btn" onClick={handleStage1Back}>
                  Back
                </button>
              ) : null}
              <button className="primary-btn" onClick={handleStage1Save}>
                Save and Continue
              </button>
            </div>
          </div>
          {feedback ? <p className="feedback success">{feedback}</p> : null}
        </div>
      ) : null}

      {screen === "stage2Assessment" ? (
        <div className="container onboarding-layout">
          <StageIndicator
            step={stage2Step}
            total={stage2Sections.length}
            title={currentStage2.title}
            stageLabel="Stage 2"
          />

          <AssessmentSectionCard
            section={currentStage2}
            answers={stage2Answers}
            errors={stage2Errors}
            onAnswer={handleAnswer}
          />

          <div className="actions">
            <button className="ghost-btn" onClick={handleSignOut}>
              Sign Out
            </button>
            <div>
              {stage2Step > 1 ? (
                <button className="ghost-btn" onClick={handleStage2Back}>
                  Back
                </button>
              ) : null}
              <button className="primary-btn" onClick={handleStage2Save}>
                Save and Continue
              </button>
            </div>
          </div>
          {feedback ? <p className="feedback success">{feedback}</p> : null}
        </div>
      ) : null}

      {screen === "stage2Results" ? (
        <div className="container summary-layout results-screen">
          <ScoreDashboard results={stage2Results} />
          <div className="actions results-actions">
            <button className="ghost-btn" onClick={handleRetakeAssessment}>
              Retake Stage 2
            </button>
            <button className="primary-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
