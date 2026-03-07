function joinAreaTitles(areas) {
  return areas.map((area) => area.title).join(", ");
}

export function generateExecutiveSummary(results, text) {
  const overall = results?.overall ?? 0;
  const lowAreas = results?.lowMaturityAreas ?? [];
  const weakAreaText = lowAreas.length ? joinAreaTitles(lowAreas) : text.common.profileNotSet;
  const topArea = lowAreas[0]?.title || text.common.profileNotSet;

  if (overall >= 75) {
    return `${text.executive.high.readiness}; ${text.executive.weakAreasPrefix} ${weakAreaText}. ${text.executive.high.priority}: ${topArea}.`;
  }

  if (overall >= 45) {
    return `${text.executive.medium.readiness}; ${text.executive.weakAreasPrefix} ${weakAreaText}. ${text.executive.medium.priority}: ${topArea}.`;
  }

  return `${text.executive.low.readiness}; ${text.executive.weakAreasPrefix} ${weakAreaText}. ${text.executive.low.priority}: ${topArea}.`;
}
