export const USERS_KEY = "tisax_prototype_users";
export const SESSION_KEY = "tisax_prototype_session";
export const PROFILE_KEY_PREFIX = "tisax_prototype_profile";
export const STAGE2_ANSWERS_KEY_PREFIX = "tisax_prototype_stage2_answers";
export const STAGE2_RESULTS_KEY_PREFIX = "tisax_prototype_stage2_results";
export const LANGUAGE_KEY = "tisax_prototype_language";
export const THEME_KEY = "busiber_theme";
export const ASSETS_KEY = "busiber_assets";
export const THREATS_KEY = "busiber_threats";
export const VULNS_KEY = "busiber_vulnerabilities";

export function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading localStorage key "${key}":`, e);
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing to localStorage key "${key}":`, e);
  }
}

export function buildUserKey(prefix, username) {
  return `${prefix}_${username}`;
}

export function getUserProfile(username) {
  if (!username) return null;
  return readJson(buildUserKey(PROFILE_KEY_PREFIX, username), null);
}

export function saveUserProfile(username, value) {
  if (!username) return;
  writeJson(buildUserKey(PROFILE_KEY_PREFIX, username), value);
}

export function getUserStage2Answers(username) {
  if (!username) return {};
  return readJson(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username), {});
}

export function saveUserStage2Answers(username, value) {
  if (!username) return;
  writeJson(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username), value);
}

export function clearUserStage2Answers(username) {
  if (!username) return;
  localStorage.removeItem(buildUserKey(STAGE2_ANSWERS_KEY_PREFIX, username));
}

export function getUserStage2Results(username) {
  if (!username) return null;
  return readJson(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username), null);
}

export function saveUserStage2Results(username, value) {
  if (!username) return;
  writeJson(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username), value);
}

export function clearUserStage2Results(username) {
  if (!username) return;
  localStorage.removeItem(buildUserKey(STAGE2_RESULTS_KEY_PREFIX, username));
}
