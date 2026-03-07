export const maturityLevels = [
  { value: "not_implemented", score: 0 },
  { value: "partially_implemented", score: 1 },
  { value: "defined", score: 2 },
  { value: "managed", score: 3 },
  { value: "optimized", score: 4 },
];

const stage2Blueprint = [
  {
    id: "governance",
    questions: ["gov_policy_framework", "gov_risk_governance", "gov_role_responsibility"],
  },
  {
    id: "asset_protection",
    questions: ["asset_inventory", "asset_data_classification", "asset_protection_controls"],
  },
  {
    id: "iam",
    questions: ["iam_mfa", "iam_joiner_mover_leaver", "iam_privileged_access"],
  },
  {
    id: "third_party",
    questions: ["tp_due_diligence", "tp_contractual_controls", "tp_monitoring"],
  },
  {
    id: "incident_response",
    questions: ["ir_monitoring", "ir_playbooks", "ir_post_incident"],
  },
  {
    id: "business_continuity",
    questions: ["bcp_documented", "bcp_tested", "bcp_dependencies"],
  },
  {
    id: "awareness",
    questions: ["awareness_program", "awareness_phishing", "awareness_role_based"],
  },
];

export function getStage2Sections(text) {
  const localizedSections = text.stage2.sections;

  return stage2Blueprint.map((section) => {
    const localizedSection = localizedSections[section.id];

    return {
      id: section.id,
      title: localizedSection.title,
      helper: localizedSection.helper,
      questions: section.questions.map((questionId) => {
        const localizedQuestion = localizedSection.questions[questionId];
        return {
          id: questionId,
          text: localizedQuestion.text,
          helper: localizedQuestion.helper || "",
        };
      }),
    };
  });
}
