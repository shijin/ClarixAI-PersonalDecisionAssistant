// ─────────────────────────────────────
// Storage helper
// Uses localStorage for persistence
// across navigation and redirects
// Falls back to sessionStorage for
// backward compatibility
// ─────────────────────────────────────

export const storage = {
  getSituation() {
    return (
      localStorage.getItem("clarix_situation") ||
      sessionStorage.getItem("clarix_situation") ||
      null
    );
  },

  setSituation(value) {
    localStorage.setItem("clarix_situation", value);
    sessionStorage.setItem("clarix_situation", value);
  },

  removeSituation() {
    localStorage.removeItem("clarix_situation");
    sessionStorage.removeItem("clarix_situation");
  },

  getRecommendation() {
    const val =
      localStorage.getItem("clarix_recommendation") ||
      sessionStorage.getItem("clarix_recommendation") ||
      null;
    if (!val) return null;
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  },

  setRecommendation(value) {
    const str = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem("clarix_recommendation", str);
    sessionStorage.setItem("clarix_recommendation", str);
  },

  removeRecommendation() {
    localStorage.removeItem("clarix_recommendation");
    sessionStorage.removeItem("clarix_recommendation");
  },

  clearAll() {
    localStorage.removeItem("clarix_situation");
    localStorage.removeItem("clarix_recommendation");
    localStorage.removeItem("clarix_draft_id");
    localStorage.removeItem("clarix_back_to");
    sessionStorage.removeItem("clarix_situation");
    sessionStorage.removeItem("clarix_recommendation");
    sessionStorage.removeItem("clarix_return_to");
  },
};
