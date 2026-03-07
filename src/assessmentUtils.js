import { maturityLevels } from "./stage2Data";

const scoreMap = maturityLevels.reduce((acc, level) => {
  acc[level.value] = level.score;
  return acc;
}, {});

function round(value) {
  return Math.round(value * 10) / 10;
}

export function computeAssessmentResults(sections, answers, recommendationCatalog = {}, baselineRecommendations = []) {
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
    recommendations: buildRecommendations(lowMaturityAreas, recommendationCatalog, baselineRecommendations),
  };
}

function buildRecommendations(lowMaturityAreas, recommendationCatalog, baselineRecommendations) {
  const targeted = lowMaturityAreas.map((area) => recommendationCatalog[area.id]).filter(Boolean);
  return [...targeted, ...baselineRecommendations].slice(0, 5);
}

export function validateSectionQuestions(section, answers, requiredMessage) {
  const errors = {};
  section.questions.forEach((question) => {
    if (!answers[question.id]) {
      errors[question.id] = requiredMessage;
    }
  });
  return errors;
}
