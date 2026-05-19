import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ReportsView from "./components/ReportsView";
import AuthCard from "./components/AuthCard";
import StageIndicator from "./components/StageIndicator";
import { FormSection, InputField, SelectField, TextAreaField } from "./components/FormSection";
import AssessmentSectionCard from "./components/AssessmentSectionCard";
import ScoreDashboard from "./components/ScoreDashboard";
import { computeAssessmentResults, validateSectionQuestions } from "./assessmentUtils";
import { generateExecutiveSummary } from "./executiveSummary";
import { getStage2Sections, maturityLevels } from "./stage2Data";
import { defaultLanguage, getText } from "./i18n/translations";
import UserManagementPage from "./components/UserManagementPage";
import AssetManagementPage from "./components/AssetManagementPage";
import RiskManagementPage from "./components/RiskManagementPage";
import ThreatModelingPage from "./components/ThreatModelingPage";
import MainDashboardPage from "./components/MainDashboardPage";
import Iso21434AuditPage from "./components/Iso21434AuditPage";
import TisaxAuditPage from "./components/TisaxAuditPage";
import LoginPage from "./components/LoginPage";
import VulnerabilityPage from "./components/VulnerabilityPage";

const USERS_KEY = "tisax_prototype_users";
const SESSION_KEY = "tisax_prototype_session";
const PROFILE_KEY_PREFIX = "tisax_prototype_profile";
const STAGE2_ANSWERS_KEY_PREFIX = "tisax_prototype_stage2_answers";
const STAGE2_RESULTS_KEY_PREFIX = "tisax_prototype_stage2_results";
const LANGUAGE_KEY = "tisax_prototype_language";
const ASSETS_KEY = "busiber_assets";
const THREATS_KEY = "busiber_threats";
const VULNS_KEY = "busiber_vulnerabilities";

const seedUsers = [
  { username: "bilgin", password: "1qaz2wsx", role: "Yönetici", name: "Bilgin Yönetici", firstLogin: false },
  { username: "bilginx", password: "1qazwsX", companyName: "BUSİBER Admin", firstLogin: false },
  { username: "new_admin", password: "Welcome123!", companyName: "BlueForge Mobility", firstLogin: true },
];

const initialAssets = [
  { id: "V-1001", name: "Sunucu", type: "Sunucu / Donanım", location: "Veri Merkezi - Sistem Odası", owner: "Bilgi İşlem", status: "Aktif", cia: { c: 3, i: 3, a: 3 } },
  { id: "V-1002", name: "Kullanıcı Bilgisayarı", type: "İş İstasyonu", location: "Mühendislik Departmanı", owner: "Melih Kaan", status: "Aktif", cia: { c: 2, i: 2, a: 2 } },
  { id: "V-1003", name: "Laptop", type: "Taşınabilir Cihaz", location: "Yönetim Ofisi", owner: "Banu Sencer", status: "Aktif", cia: { c: 3, i: 2, a: 2 } },
  { id: "V-1004", name: "Switch ve Ağ Cihazları", type: "Ağ Altyapısı", location: "Omurga Kabini - Kat 1", owner: "Ağ Yönetimi", status: "Aktif", cia: { c: 1, i: 2, a: 3 } }
];

const initialVulnerabilities = [
  { id: 'CVE-2024-001', asset: 'Merkezi Sunucu', severity: 'Kritik', status: 'Açık', date: '18.05.2026' },
  { id: 'CVE-2024-012', asset: 'Ağ Switch (Kat 1)', severity: 'Yüksek', status: 'İşlemde', date: '17.05.2026' }
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
    requiredFields: ["companyName", "companySize", "industrySector", "numberOfEmployees", "countryRegion", "officeLocations"],
  },
  {
    requiredFields: ["itEnvironment", "thirdPartyProviders", "criticalAssets"],
  },
  {
    requiredFields: ["securityPolicies", "certificationStatus", "regulatoryRequirements"],
  },
  {
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

function buildUserKey(prefix, username) {
  return `${prefix}_${username}`;
}

function getUserProfile(username) {
  if (!username) return null;
  return readJson(buildUserKey(PROFILE_KEY_PREFIX, username), null);
}

function saveUserProfile(username, value) {
  if (!username) return;
  writeJson(buildUserKey(PROFILE_KEY_PREFIX, username), value);
}

function getUserStage2Answers(username) {
  if (!username) return {};
  return readJson(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username), {});
}

function saveUserStage2Answers(username, value) {
  if (!username) return;
  writeJson(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username), value);
}

function clearUserStage2Answers(username) {
  if (!username) return;
  localStorage.removeItem(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username));
}

function getUserStage2Results(username) {
  if (!username) return null;
  return readJson(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username), null);
}

function saveUserStage2Results(username, value) {
  if (!username) return;
  writeJson(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username), value);
}

function clearUserStage2Results(username) {
  if (!username) return;
  localStorage.removeItem(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username));
}

function ensureUsers() {
  let users = readJson(USERS_KEY, null);
  if (!users) {
    writeJson(USERS_KEY, seedUsers);
    return seedUsers;
  }
  let updated = false;
  if (!users.some(u => u.username === "bilginx")) {
    users = [...seedUsers.filter(s => s.username === "bilginx"), ...users];
    updated = true;
  }
  if (!users.some(u => u.username === "bilgin")) {
    users = [...seedUsers.filter(s => s.username === "bilgin"), ...users];
    updated = true;
  }
  if (updated) writeJson(USERS_KEY, users);
  return users;
}

function validateStep(values, requiredFields, requiredFieldMessage) {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!String(values[field] ?? "").trim()) errors[field] = requiredFieldMessage;
  });
  return errors;
}

function getScreenForSession(activeSession) {
  if (!activeSession) return "auth";
  const hasStage1Profile = Boolean(getUserProfile(activeSession.username)?.companyName);
  if (activeSession.firstLogin || !hasStage1Profile) return "onboarding";
  const cachedResults = getUserStage2Results(activeSession.username);
  return cachedResults ? "stage2Results" : "stage2Assessment";
}

function JourneyNav({ current, text }) {
  const journeySteps = [
    { id: "onboarding", label: text.journey.stage1 },
    { id: "stage2Assessment", label: text.journey.stage2 },
    { id: "stage2Results", label: text.journey.results },
  ];

  const currentIndex = journeySteps.findIndex((step) => step.id === current);

  return (
    <section className="card journey-nav">
      {journeySteps.map((step, index) => (
        <div
          key={step.id}
          className={`journey-step ${index === currentIndex ? "is-current" : ""} ${index < currentIndex ? "is-done" : ""}`}
        >
          <span>{index + 1}</span>
          <p>{step.label}</p>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) || defaultLanguage);
  const text = getText(language);

  const stage2Sections = useMemo(() => getStage2Sections(text), [text]);
  const maturityOptions = useMemo(
    () => maturityLevels.map((level) => ({ value: level.value, label: text.stage2.maturityOptions[level.value] })),
    [text],
  );

  const [users, setUsers] = useState(() => ensureUsers());
  const [currentUser, setCurrentUser] = useState(() => readJson(SESSION_KEY, null));
  const [screen, setScreen] = useState(() => getScreenForSession(readJson(SESSION_KEY, null)));
  const [activeView, setActiveView] = useState("dashboard");
  const [feedback, setFeedback] = useState("");

  // Shared Centralized Data Havuzu (Lifted Up + LocalStorage Persistence)
  const [assets, setAssets] = useState(() => readJson(ASSETS_KEY, initialAssets));
  const [threats, setThreats] = useState(() => readJson(THREATS_KEY, []));
  const [vulnerabilities, setVulnerabilities] = useState(() => readJson(VULNS_KEY, initialVulnerabilities));

  // Sync states to localStorage
  useEffect(() => { writeJson(ASSETS_KEY, assets); }, [assets]);
  useEffect(() => { writeJson(THREATS_KEY, threats); }, [threats]);
  useEffect(() => { writeJson(VULNS_KEY, vulnerabilities); }, [vulnerabilities]);
  useEffect(() => { writeJson(USERS_KEY, users); }, [users]);

  const [stage1Step, setStage1Step] = useState(1);
  const [stage1Errors, setStage1Errors] = useState({});
  const [profile, setProfile] = useState(() => {
    const active = readJson(SESSION_KEY, null);
    const saved = getUserProfile(active?.username);
    return { ...emptyProfile, ...saved, companyName: saved?.companyName || active?.companyName || "" };
  });

  const [stage2Step, setStage2Step] = useState(1);
  const [stage2Errors, setStage2Errors] = useState({});
  const [stage2Answers, setStage2Answers] = useState(() => {
    const active = readJson(SESSION_KEY, null);
    return getUserStage2Answers(active?.username);
  });
  const [stage2Results, setStage2Results] = useState(() => {
    const active = readJson(SESSION_KEY, null);
    return getUserStage2Results(active?.username);
  });

  const [activeRole, setActiveRole] = useState(() => currentUser?.role === "Denetçi" ? "auditor" : "admin");

  useEffect(() => {
    if (activeRole === "auditor" && screen === "onboarding") {
      setScreen("stage2Assessment");
    }
  }, [activeRole, screen]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role === "Denetçi" ? "auditor" : "admin");
    }
  }, [currentUser]);

  const updateField = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }));

  const hydrateUserState = (user) => {
    const userProfile = getUserProfile(user.username);
    const userAnswers = getUserStage2Answers(user.username);
    const userResults = getUserStage2Results(user.username);

    setProfile({
      ...emptyProfile,
      ...userProfile,
      companyName: userProfile?.companyName || user.companyName || "",
    });
    setStage2Answers(userAnswers);
    setStage2Results(userResults);
    setStage1Step(1);
    setStage2Step(1);
    setStage1Errors({});
    setStage2Errors({});
  };

  const handleSignIn = (user) => {
    writeJson(SESSION_KEY, user);
    setCurrentUser(user);
    hydrateUserState(user);
    setScreen(getScreenForSession(user));
  };

  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setScreen("auth");
    setStage1Step(1);
    setStage2Step(1);
    setStage1Errors({});
    setStage2Errors({});
    setProfile(emptyProfile);
    setStage2Answers({});
    setStage2Results(null);
    setFeedback("");
  };

  const handleAddUserGlobal = (newUser) => {
    if (users.some(u => u.username === newUser.username)) {
      return { success: false, message: text.feedback.usernameExists };
    }
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    writeJson(USERS_KEY, updatedUsers);
    return { success: true };
  };

  const handleStage1Save = () => {
    const current = stage1Config[stage1Step - 1];
    const nextErrors = validateStep(profile, current.requiredFields, text.common.requiredField);
    setStage1Errors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    saveUserProfile(currentUser?.username, profile);
    setFeedback(text.feedback.stage1Saved);

    if (stage1Step < stage1Config.length) {
      setStage1Step((prev) => prev + 1);
      return;
    }

    const updatedUsers = users.map((item) =>
      item.username === currentUser.username ? { ...item, firstLogin: false, companyName: profile.companyName } : item,
    );
    const updatedSession = { ...currentUser, firstLogin: false, companyName: profile.companyName };

    setUsers(updatedUsers);
    writeJson(USERS_KEY, updatedUsers);
    writeJson(SESSION_KEY, updatedSession);
    setCurrentUser(updatedSession);
    setScreen("stage2Assessment");
    setFeedback(text.feedback.stage1Complete);
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
      saveUserStage2Answers(currentUser?.username, next);
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
    const nextErrors = validateSectionQuestions(currentSection, stage2Answers, text.common.requiredField);
    setStage2Errors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setFeedback(text.feedback.stage2Incomplete);
      return;
    }

    setFeedback(text.feedback.stage2Saved);

    if (stage2Step < stage2Sections.length) {
      setStage2Step((prev) => prev + 1);
      return;
    }

    const results = computeAssessmentResults(
      stage2Sections,
      stage2Answers,
      text.recommendations.catalog,
      text.recommendations.baseline,
    );
    
    const now = new Date();
    results.completedAt = `${now.toLocaleDateString("tr-TR")} ${now.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}`;
    
    saveUserStage2Results(currentUser?.username, results);
    setStage2Results(results);
    setScreen("stage2Results");
    setFeedback(text.feedback.stage2Complete);
  };

  const handleStage2Back = () => {
    setFeedback("");
    setStage2Errors({});
    setStage2Step((prev) => Math.max(1, prev - 1));
  };

  const handleEditProfile = () => {
    if (!currentUser) return;
    const savedProfile = getUserProfile(currentUser.username);
    setProfile({
      ...emptyProfile,
      ...savedProfile,
      companyName: savedProfile?.companyName || currentUser.companyName || "",
    });
    setStage1Step(1);
    setStage1Errors({});
    setFeedback(text.feedback.editProfile);
    setScreen("onboarding");
  };

  const handleRetakeAssessment = () => {
    clearUserStage2Answers(currentUser?.username);
    clearUserStage2Results(currentUser?.username);
    setStage2Answers({});
    setStage2Results(null);
    setStage2Errors({});
    setStage2Step(1);
    setFeedback(text.feedback.stage2Reset);
    setScreen("stage2Assessment");
  };

  const stage1Text = text.stage1.sections[stage1Step - 1];
  const currentStage2 = stage2Sections[stage2Step - 1];

  const localizedResults = useMemo(() => {
    if (!stage2Results || Object.keys(stage2Answers).length === 0) return null;
    return computeAssessmentResults(
      stage2Sections,
      stage2Answers,
      text.recommendations.catalog,
      text.recommendations.baseline,
    );
  }, [stage2Results, stage2Sections, stage2Answers, text]);

  const activeResults = localizedResults || stage2Results;
  const executiveSummary = activeResults ? generateExecutiveSummary(activeResults, text) : text.common.scoreNotSet;

  if (!currentUser) {
    return <LoginPage users={users} onLogin={handleSignIn} />;
  }

  const appContent = (
    <main className="app-shell">
      <section className="language-switcher card">
        <span>{text.language.switcherLabel}</span>
        <div>
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>
            {text.language.en}
          </button>
          <button className={language === "tr" ? "active" : ""} onClick={() => setLanguage("tr")}>
            {text.language.tr}
          </button>
        </div>
      </section>

      {screen === "onboarding" ? (
        <div className="container onboarding-layout">
          <JourneyNav current="onboarding" text={text} />
          <StageIndicator
            step={stage1Step}
            total={stage1Config.length}
            title={stage1Text.indicatorTitle}
            stageLabel={text.journey.stage1}
            stepLabel={text.common.step}
          />
          {stage1Step === 1 && (
            <FormSection title={stage1Text.title} description={stage1Text.description}>
              <div className="grid two-col">
                <InputField label={text.stage1.fields.companyName.label} required helper={text.stage1.fields.companyName.helper} value={profile.companyName} onChange={(v) => updateField("companyName", v)} error={stage1Errors.companyName} />
                <SelectField label={text.stage1.fields.companySize.label} required helper={text.stage1.fields.companySize.helper} options={text.stage1.options.companySize} value={profile.companySize} onChange={(v) => updateField("companySize", v)} error={stage1Errors.companySize} />
                <SelectField label={text.stage1.fields.industrySector.label} required helper={text.stage1.fields.industrySector.helper} options={text.stage1.options.industry} value={profile.industrySector} onChange={(v) => updateField("industrySector", v)} error={stage1Errors.industrySector} />
                <InputField label={text.stage1.fields.numberOfEmployees.label} required type="number" helper={text.stage1.fields.numberOfEmployees.helper} value={profile.numberOfEmployees} onChange={(v) => updateField("numberOfEmployees", v)} error={stage1Errors.numberOfEmployees} />
                <InputField label={text.stage1.fields.countryRegion.label} required helper={text.stage1.fields.countryRegion.helper} value={profile.countryRegion} onChange={(v) => updateField("countryRegion", v)} error={stage1Errors.countryRegion} />
                <InputField label={text.stage1.fields.officeLocations.label} required type="number" helper={text.stage1.fields.officeLocations.helper} value={profile.officeLocations} onChange={(v) => updateField("officeLocations", v)} error={stage1Errors.officeLocations} />
              </div>
            </FormSection>
          )}
          {stage1Step === 2 && (
            <FormSection title={stage1Text.title} description={stage1Text.description}>
              <div className="grid two-col">
                <SelectField label={text.stage1.fields.itEnvironment.label} required helper={text.stage1.fields.itEnvironment.helper} options={text.stage1.options.itEnvironment} value={profile.itEnvironment} onChange={(v) => updateField("itEnvironment", v)} error={stage1Errors.itEnvironment} />
                <SelectField label={text.stage1.fields.thirdPartyProviders.label} required helper={text.stage1.fields.thirdPartyProviders.helper} options={text.stage1.options.yesNoPartial} value={profile.thirdPartyProviders} onChange={(v) => updateField("thirdPartyProviders", v)} error={stage1Errors.thirdPartyProviders} />
                <TextAreaField label={text.stage1.fields.criticalAssets.label} required helper={text.stage1.fields.criticalAssets.helper} value={profile.criticalAssets} onChange={(v) => updateField("criticalAssets", v)} error={stage1Errors.criticalAssets} />
              </div>
            </FormSection>
          )}
          {stage1Step === 3 && (
            <FormSection title={stage1Text.title} description={stage1Text.description}>
              <div className="grid two-col">
                <SelectField label={text.stage1.fields.securityPolicies.label} required helper={text.stage1.fields.securityPolicies.helper} options={text.stage1.options.yesNoPartial} value={profile.securityPolicies} onChange={(v) => updateField("securityPolicies", v)} error={stage1Errors.securityPolicies} />
                <SelectField label={text.stage1.fields.certificationStatus.label} required helper={text.stage1.fields.certificationStatus.helper} options={text.stage1.options.certification} value={profile.certificationStatus} onChange={(v) => updateField("certificationStatus", v)} error={stage1Errors.certificationStatus} />
                <TextAreaField label={text.stage1.fields.regulatoryRequirements.label} required helper={text.stage1.fields.regulatoryRequirements.helper} value={profile.regulatoryRequirements} onChange={(v) => updateField("regulatoryRequirements", v)} error={stage1Errors.regulatoryRequirements} />
              </div>
            </FormSection>
          )}
          {stage1Step === 4 && (
            <FormSection title={stage1Text.title} description={stage1Text.description}>
              <div className="grid two-col">
                <SelectField label={text.stage1.fields.maturityLevel.label} required helper={text.stage1.fields.maturityLevel.helper} options={text.stage1.options.maturity} value={profile.maturityLevel} onChange={(v) => updateField("maturityLevel", v)} error={stage1Errors.maturityLevel} />
                <TextAreaField label={text.stage1.fields.mainConcerns.label} required helper={text.stage1.fields.mainConcerns.helper} value={profile.mainConcerns} onChange={(v) => updateField("mainConcerns", v)} error={stage1Errors.mainConcerns} />
              </div>
            </FormSection>
          )}
          <div className="actions">
            <button className="ghost-btn" onClick={handleSignOut}>{text.common.signOut}</button>
            <div>
              {stage1Step > 1 && <button className="ghost-btn" onClick={handleStage1Back}>{text.common.back}</button>}
              <button className="primary-btn" onClick={handleStage1Save}>{stage1Step === stage1Config.length ? text.common.continueToStage2 : text.common.saveAndContinue}</button>
            </div>
          </div>
          {feedback && <p className="feedback success">{feedback}</p>}
        </div>
      ) : null}

      {screen === "stage2Assessment" ? (
        <div className="container onboarding-layout">
          <JourneyNav current="stage2Assessment" text={text} />
          <StageIndicator step={stage2Step} total={stage2Sections.length} title={currentStage2.title} stageLabel={text.journey.stage2} stepLabel={text.common.step} />
          <section className="card stage-context">
            <p className="kicker">{text.journey.sharedProfile}</p>
            <strong>{profile.companyName || currentUser?.companyName || text.common.profileNotSet}</strong>
            <p>{profile.industrySector || text.common.profileNotSet} · {profile.companySize || text.common.profileNotSet} · {profile.countryRegion || text.common.profileNotSet}</p>
          </section>
          <AssessmentSectionCard section={currentStage2} answers={stage2Answers} errors={stage2Errors} onAnswer={handleAnswer} maturityOptions={maturityOptions} />
          <div className="actions">
            <button className="ghost-btn" onClick={handleSignOut}>{text.common.signOut}</button>
            <div>
              <button className="ghost-btn" onClick={handleEditProfile}>{text.journey.editProfile}</button>
              {stage2Step > 1 && <button className="ghost-btn" onClick={handleStage2Back}>{text.common.back}</button>}
              <button className="primary-btn" onClick={handleStage2Save}>{text.common.saveAndContinue}</button>
            </div>
          </div>
          {feedback && <p className="feedback success">{feedback}</p>}
        </div>
      ) : null}

      {screen === "stage2Results" ? (
        <div className="container summary-layout results-screen">
          <JourneyNav current="stage2Results" text={text} />
          <ScoreDashboard results={activeResults} executiveSummary={executiveSummary} text={text.results} />
          <div className="actions results-actions">
            <button className="ghost-btn" onClick={handleEditProfile}>{text.journey.editProfile}</button>
            <button className="ghost-btn" onClick={handleRetakeAssessment}>{text.results.retake}</button>
            <button className="primary-btn" onClick={handleSignOut}>{text.common.signOut}</button>
          </div>
        </div>
      ) : null}
    </main>
  );

  const getViewTitle = (view) => {
    switch (view) {
      case "dashboard": return "Ana Sayfa / Pano";
      case "hizli-test": return "Hızlı Siber Olgunluk Testi";
      case "tisax": return "TISAX Denetimi";
      case "iso": return "ISO/SAE 21434 Denetimi";
      case "varlik": return "Varlık Yönetimi";
      case "risk": return "Risk Yönetimi";
      case "tehdit": return "Tehdit Modellemesi";
      case "zafiyet": return "Zafiyet ve Sızma Testi Yönetimi";
      case "raporlama": return "Raporlama ve Analiz";
      case "kullanici-yonetimi": return "Kullanıcı Yönetimi";
      default: return "";
    }
  };

  let mainView;
  if (activeView === "dashboard") {
    mainView = (
      <MainDashboardPage 
        onNavigate={(id) => setActiveView(id)} 
        assets={assets}
        vulnerabilities={vulnerabilities}
      />
    );
  } else if (activeView === "hizli-test") {
    mainView = appContent;
  } else if (activeView === "tisax") {
    mainView = <TisaxAuditPage />;
  } else if (activeView === "raporlama") {
    mainView = (
      <div className="placeholder-view">
        <h2 className="view-title">{getViewTitle("raporlama")}</h2>
        <ReportsView />
      </div>
    );
  } else if (activeView === "kullanici-yonetimi") {
    mainView = <UserManagementPage onAddUser={handleAddUserGlobal} initialUsers={users} />;
  } else if (activeView === "varlik") {
    mainView = <AssetManagementPage assets={assets} setAssets={setAssets} />;
  } else if (activeView === "risk") {
    mainView = <RiskManagementPage assets={assets} />;
  } else if (activeView === "tehdit") {
    mainView = <ThreatModelingPage assets={assets} threats={threats} setThreats={setThreats} />;
  } else if (activeView === "iso") {
    mainView = <Iso21434AuditPage assets={assets} />;
  } else if (activeView === "zafiyet") {
    mainView = <VulnerabilityPage assets={assets} vulnerabilities={vulnerabilities} setVulnerabilities={setVulnerabilities} />;
  } else {
    mainView = (
      <div className="placeholder-view">
        <h2 className="view-title">{getViewTitle(activeView)}</h2>
        <div className="card empty-state">
          <p>Bu modül şu anda hazırlık aşamasındadır.</p>
          <button className="primary-btn" onClick={() => setActiveView("hizli-test")}>Hızlı Test'e Dön</button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeView} 
      onTabChange={setActiveView}
      activeRole={activeRole}
      onRoleChange={setActiveRole}
      currentUser={currentUser}
      onLogout={handleSignOut}
    >
      {mainView}
    </Layout>
  );
}
