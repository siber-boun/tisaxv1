export const maturityLevels = [
  { label: "Not Implemented", value: "not_implemented", score: 0 },
  { label: "Partially Implemented", value: "partially_implemented", score: 1 },
  { label: "Defined", value: "defined", score: 2 },
  { label: "Managed", value: "managed", score: 3 },
  { label: "Optimized", value: "optimized", score: 4 },
];

export const stage2Sections = [
  {
    id: "governance",
    title: "Governance and Security Policies",
    helper: "Evaluate ownership, policy quality, and oversight discipline.",
    questions: [
      {
        id: "gov_policy_framework",
        text: "Do you maintain a documented and approved cybersecurity policy framework?",
        helper: "Include policy ownership, periodic review, and management sign-off.",
      },
      {
        id: "gov_risk_governance",
        text: "Is cybersecurity risk reviewed by leadership using a formal governance cadence?",
        helper: "Examples: monthly steering meetings, defined risk acceptance process.",
      },
      {
        id: "gov_role_responsibility",
        text: "Are security roles and responsibilities clearly defined across business and IT teams?",
      },
    ],
  },
  {
    id: "asset_protection",
    title: "Asset and Information Protection",
    helper: "Measure data classification, protection controls, and lifecycle handling.",
    questions: [
      {
        id: "asset_inventory",
        text: "Is there a complete and updated inventory of critical assets and data repositories?",
      },
      {
        id: "asset_data_classification",
        text: "Do you classify sensitive data and enforce handling rules by classification level?",
      },
      {
        id: "asset_protection_controls",
        text: "Are encryption, backup, and endpoint protection controls consistently applied to critical systems?",
      },
    ],
  },
  {
    id: "iam",
    title: "Identity and Access Management",
    helper: "Assess identity controls, least privilege, and access lifecycle maturity.",
    questions: [
      {
        id: "iam_mfa",
        text: "Is multi-factor authentication enforced for privileged and remote access?",
      },
      {
        id: "iam_joiner_mover_leaver",
        text: "Are joiner-mover-leaver processes automated and timely for access provisioning and deprovisioning?",
      },
      {
        id: "iam_privileged_access",
        text: "Do you regularly review privileged accounts and apply least-privilege principles?",
      },
    ],
  },
  {
    id: "third_party",
    title: "Third-Party / Supplier Security",
    helper: "Understand external risk management maturity.",
    questions: [
      {
        id: "tp_due_diligence",
        text: "Do you perform cybersecurity due diligence before onboarding suppliers?",
      },
      {
        id: "tp_contractual_controls",
        text: "Are security requirements and incident notification obligations included in supplier contracts?",
      },
      {
        id: "tp_monitoring",
        text: "Do you periodically reassess supplier risk and monitor high-risk vendors?",
      },
    ],
  },
  {
    id: "incident_response",
    title: "Incident Detection and Response",
    helper: "Gauge readiness to detect, contain, and recover from incidents.",
    questions: [
      {
        id: "ir_monitoring",
        text: "Do you have centralized logging and monitoring for suspicious security events?",
      },
      {
        id: "ir_playbooks",
        text: "Are documented incident response playbooks tested through exercises?",
      },
      {
        id: "ir_post_incident",
        text: "Do you conduct post-incident reviews and track corrective actions?",
      },
    ],
  },
  {
    id: "business_continuity",
    title: "Business Continuity and Recovery",
    helper: "Evaluate resilience planning and operational recovery strength.",
    questions: [
      {
        id: "bcp_documented",
        text: "Is there a documented business continuity and disaster recovery plan for critical services?",
      },
      {
        id: "bcp_tested",
        text: "Are recovery objectives (RTO/RPO) defined and validated through testing?",
      },
      {
        id: "bcp_dependencies",
        text: "Do continuity plans account for third-party and infrastructure dependencies?",
      },
    ],
  },
  {
    id: "awareness",
    title: "Security Awareness and Training",
    helper: "Assess workforce awareness and secure behavior reinforcement.",
    questions: [
      {
        id: "awareness_program",
        text: "Is there a structured and recurring security awareness program for employees?",
      },
      {
        id: "awareness_phishing",
        text: "Do you run phishing simulations or practical training to reinforce behavior?",
      },
      {
        id: "awareness_role_based",
        text: "Is role-based security training delivered for high-risk functions (IT, finance, executives)?",
      },
    ],
  },
];
