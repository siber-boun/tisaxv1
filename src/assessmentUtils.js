import { maturityLevels } from "./stage2Data";

const scoreMap = maturityLevels.reduce((acc, level) => {
  acc[level.value] = level.score;
  return acc;
}, {});

function round(value) {
  return Math.round(value * 10) / 10;
}

export function computeAssessmentResults(sections, answers) {
  const sectionScores = sections.map((section) => {
    const numeric = section.questions.map((question) => scoreMap[answers[question.id]] ?? 0);
    const max = section.questions.length * 4;
    const total = numeric.reduce((sum, item) => sum + item, 0);
    const percentage = max ? (total / max) * 100 : 0;

    return {
      id: section.id,
      title: section.title,
      score: round(percentage),
      averageLevel: round(total / section.questions.length),
      answered: section.questions.filter((question) => Boolean(answers[question.id])).length,
      questionCount: section.questions.length,
    };
  });

  const overall = sectionScores.length
    ? round(sectionScores.reduce((sum, section) => sum + section.score, 0) / sectionScores.length)
    : 0;

  const lowMaturityAreas = [...sectionScores].sort((a, b) => a.score - b.score).slice(0, 3);

  return {
    overall,
    sectionScores,
    lowMaturityAreas,
    recommendations: buildRecommendations(lowMaturityAreas),
    summary: buildSummary(overall, lowMaturityAreas),
  };
}

function buildSummary(overall, lowMaturityAreas) {
  if (overall >= 75) {
    return "Your organization demonstrates a solid cybersecurity foundation with opportunities to optimize consistency across all domains.";
  }

  if (overall >= 45) {
    return `Your organization has developing cybersecurity practices. Priority improvement is recommended in ${lowMaturityAreas
      .map((area) => area.title)
      .join(", ")}.`;
  }

  return "Your assessment indicates early-stage cybersecurity maturity. A focused improvement program is advised to reduce immediate operational and compliance risk.";
}

function buildRecommendations(lowMaturityAreas) {
  const catalog = {
    governance: "Establish a formal governance cadence with policy ownership, leadership review, and measurable risk decisions.",
    asset_protection:
      "Create a complete asset inventory and enforce classification-based controls for sensitive data protection.",
    iam: "Implement stronger IAM hygiene with MFA coverage, privilege reviews, and automated access lifecycle controls.",
    third_party:
      "Strengthen supplier security by introducing risk-tiered due diligence and contractual cyber control requirements.",
    incident_response:
      "Improve incident readiness with tested playbooks, centralized detection, and post-incident corrective action tracking.",
    business_continuity:
      "Define and test continuity objectives, including dependency-aware disaster recovery for critical operations.",
    awareness:
      "Expand awareness programs with role-based training and recurring practical simulations such as phishing exercises.",
  };

  const targeted = lowMaturityAreas.map((area) => catalog[area.id]).filter(Boolean);

  const baseline = [
    "Define a 90-day remediation roadmap with accountable owners and monthly progress checkpoints.",
    "Track improvement KPIs per domain to demonstrate measurable maturity gains over time.",
  ];

  return [...targeted, ...baseline].slice(0, 5);
}

export function validateSectionQuestions(section, answers) {
  const errors = {};
  section.questions.forEach((question) => {
    if (!answers[question.id]) {
      errors[question.id] = "Please select a maturity level.";
    }
  });
  return errors;
}
