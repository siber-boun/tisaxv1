import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Layout from "./components/Layout";
import ReportsView from "./components/ReportsView";
import AuthCard from "./components/AuthCard";
import OnboardingFlow from "./components/OnboardingFlow";
import AssessmentFlow from "./components/AssessmentFlow";
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

import * as storage from "./utils/storage";
import { seedUsers, initialAssets, initialVulnerabilities, emptyProfile, stage1Config } from "./data/initialData";

function ensureUsers() {
  let users = storage.readJson(storage.USERS_KEY, null);
  if (!users) {
    storage.writeJson(storage.USERS_KEY, seedUsers);
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
  if (updated) storage.writeJson(storage.USERS_KEY, users);
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
  const hasStage1Profile = Boolean(storage.getUserProfile(activeSession.username)?.companyName);
  if (activeSession.firstLogin || !hasStage1Profile) return "onboarding";
  const cachedResults = storage.getUserStage2Results(activeSession.username);
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
  const [language, setLanguage] = useState(() => localStorage.getItem(storage.LANGUAGE_KEY) || defaultLanguage);
  const [theme, setTheme] = useState(() => storage.readJson(storage.THEME_KEY, "dark"));
  const text = getText(language);

  const stage2Sections = useMemo(() => getStage2Sections(text), [text]);
  const maturityOptions = useMemo(
    () => maturityLevels.map((level) => ({ value: level.value, label: text.stage2.maturityOptions[level.value] })),
    [text],
  );

  const [users, setUsers] = useState(() => ensureUsers());
  const [currentUser, setCurrentUser] = useState(() => storage.readJson(storage.SESSION_KEY, null));
  const [screen, setScreen] = useState(() => getScreenForSession(storage.readJson(storage.SESSION_KEY, null)));
  const [activeView, setActiveView] = useState("dashboard");
  const [feedback, setFeedback] = useState("");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    storage.writeJson(storage.THEME_KEY, nextTheme);
  };

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [theme]);

  const [assets, setAssets] = useState(() => storage.readJson(storage.ASSETS_KEY, initialAssets));
  const [threats, setThreats] = useState(() => storage.readJson(storage.THREATS_KEY, {}));
  const [vulnerabilities, setVulnerabilities] = useState(() => storage.readJson(storage.VULNS_KEY, initialVulnerabilities));

  useEffect(() => { storage.writeJson(storage.ASSETS_KEY, assets); }, [assets]);
  useEffect(() => { storage.writeJson(storage.THREATS_KEY, threats); }, [threats]);
  useEffect(() => { storage.writeJson(storage.VULNS_KEY, vulnerabilities); }, [vulnerabilities]);
  useEffect(() => { storage.writeJson(storage.USERS_KEY, users); }, [users]);

  const [stage1Step, setStage1Step] = useState(1);
  const [stage1Errors, setStage1Errors] = useState({});
  const [profile, setProfile] = useState(() => {
    const active = storage.readJson(storage.SESSION_KEY, null);
    const saved = storage.getUserProfile(active?.username);
    return { ...emptyProfile, ...saved, companyName: saved?.companyName || active?.companyName || "" };
  });

  const [stage2Step, setStage2Step] = useState(1);
  const [stage2Errors, setStage2Errors] = useState({});
  const [stage2Answers, setStage2Answers] = useState(() => {
    const active = storage.readJson(storage.SESSION_KEY, null);
    return storage.getUserStage2Answers(active?.username);
  });
  const [stage2Results, setStage2Results] = useState(() => {
    const active = storage.readJson(storage.SESSION_KEY, null);
    return storage.getUserStage2Results(active?.username);
  });

  const [activeRole, setActiveRole] = useState(() => currentUser?.role === "Denetçi" ? "auditor" : "admin");

  useEffect(() => {
    if (activeRole === "auditor" && screen === "onboarding") {
      setScreen("stage2Assessment");
    }
  }, [activeRole, screen]);

  useEffect(() => {
    localStorage.setItem(storage.LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role === "Denetçi" ? "auditor" : "admin");
    }
  }, [currentUser]);

  const updateField = (name, value) => setProfile((prev) => ({ ...prev, [name]: value }));

  const hydrateUserState = (user) => {
    const userProfile = storage.getUserProfile(user.username);
    const userAnswers = storage.getUserStage2Answers(user.username);
    const userResults = storage.getUserStage2Results(user.username);

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
    storage.writeJson(storage.SESSION_KEY, user);
    setCurrentUser(user);
    hydrateUserState(user);
    setScreen(getScreenForSession(user));
  };

  const handleSignOut = () => {
    localStorage.removeItem(storage.SESSION_KEY);
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
    storage.writeJson(storage.USERS_KEY, updatedUsers);
    return { success: true };
  };

  const handleStage1Save = () => {
    const current = stage1Config[stage1Step - 1];
    const nextErrors = validateStep(profile, current.requiredFields, text.common.requiredField);
    setStage1Errors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    storage.saveUserProfile(currentUser?.username, profile);
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
    storage.writeJson(storage.USERS_KEY, updatedUsers);
    storage.writeJson(storage.SESSION_KEY, updatedSession);
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
      storage.saveUserStage2Answers(currentUser?.username, next);
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
    
    storage.saveUserStage2Results(currentUser?.username, results);
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
    const savedProfile = storage.getUserProfile(currentUser.username);
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
    storage.clearUserStage2Answers(currentUser?.username);
    storage.clearUserStage2Results(currentUser?.username);
    setStage2Answers({});
    setStage2Results(null);
    setStage2Errors({});
    setStage2Step(1);
    setFeedback(text.feedback.stage2Reset);
    setScreen("stage2Assessment");
  };

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
    <>
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

      {screen === "onboarding" && (
        <div className="onboarding-wrapper">
          <JourneyNav current="onboarding" text={text} />
          <OnboardingFlow 
            stage1Step={stage1Step}
            profile={profile}
            updateField={updateField}
            stage1Errors={stage1Errors}
            text={text}
            handleStage1Back={handleStage1Back}
            handleStage1Save={handleStage1Save}
            handleSignOut={handleSignOut}
            feedback={feedback}
          />
        </div>
      )}

      {screen === "stage2Assessment" && (
        <div className="onboarding-wrapper">
          <JourneyNav current="stage2Assessment" text={text} />
          <AssessmentFlow 
            stage2Step={stage2Step}
            stage2Sections={stage2Sections}
            stage2Answers={stage2Answers}
            stage2Errors={stage2Errors}
            handleAnswer={handleAnswer}
            maturityOptions={maturityOptions}
            text={text}
            profile={profile}
            currentUser={currentUser}
            handleSignOut={handleSignOut}
            handleEditProfile={handleEditProfile}
            handleStage2Back={handleStage2Back}
            handleStage2Save={handleStage2Save}
            feedback={feedback}
          />
        </div>
      )}

      {screen === "stage2Results" && (
        <div className="results-wrapper">
          <JourneyNav current="stage2Results" text={text} />
          <ScoreDashboard results={activeResults} executiveSummary={executiveSummary} text={text.results} profile={profile} />
          <div className="actions results-actions">
            <button className="ghost-btn" onClick={handleEditProfile}>{text.journey.editProfile}</button>
            <button className="ghost-btn" onClick={handleRetakeAssessment}>{text.results.retake}</button>
            <button className="primary-btn" onClick={handleSignOut}>{text.common.signOut}</button>
          </div>
        </div>
      )}
    </>
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
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {mainView}
    </Layout>
  );
}
