import { useState } from "react";
import { supabase } from "../lib/supabase";

// ─────────────────────────────────────
// useDecision
// Handles all Supabase read and write
// operations for decisions.
// Used by SavePromptScreen, HomeScreen,
// and HistoryScreen.
// ─────────────────────────────────────

export function useDecision() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Save a decision to Supabase ──
  const saveDecision = async (situation, recommendation) => {
    setSaving(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to save a decision.");
      }

      // Determine decision type from situation text
      const decisionType = detectDecisionType(situation);

      const { data, error } = await supabase
        .from("decisions")
        .insert({
          user_id: user.id,
          situation: situation,
          decision_type: decisionType,
          recommendation: recommendation.recommendation,
          summary: recommendation.summary,
          reasons: recommendation.reasons || [],
          tradeoff: recommendation.tradeoff || {},
          assumptions: recommendation.assumptions || [],
          status: "saved",
          model_used: "claude-sonnet-4-20250514",
        })
        .select()
        .single();

      if (error) throw error;

      // Log the save event
      await supabase.from("session_logs").insert({
        user_id: user.id,
        decision_id: data.id,
        event: "decision_saved",
        metadata: { decision_type: decisionType },
      });

      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // ── Fetch all decisions for current user ──
  const fetchDecisions = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in.");

      const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "saved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch a single decision by id ──
  const fetchDecision = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Delete a decision ──
  const deleteDecision = async (id) => {
    setError(null);

    try {
      const { error } = await supabase.from("decisions").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    saving,
    loading,
    error,
    saveDecision,
    fetchDecisions,
    fetchDecision,
    deleteDecision,
  };
}

// ─────────────────────────────────────
// Helper — detect decision type from
// situation text keywords
// ─────────────────────────────────────

function detectDecisionType(situation) {
  const lower = situation.toLowerCase();

  if (
    lower.includes("insurance") ||
    lower.includes("term plan") ||
    lower.includes("health cover") ||
    lower.includes("policy")
  )
    return "insurance";

  if (
    lower.includes("invest") ||
    lower.includes("sip") ||
    lower.includes("mutual fund") ||
    lower.includes("stock") ||
    lower.includes("fd") ||
    lower.includes("fixed deposit")
  )
    return "investment";

  if (
    lower.includes("job") ||
    lower.includes("offer") ||
    lower.includes("salary") ||
    lower.includes("esop") ||
    lower.includes("career") ||
    lower.includes("switch") ||
    lower.includes("resign")
  )
    return "career";

  if (
    lower.includes("buy") ||
    lower.includes("laptop") ||
    lower.includes("phone") ||
    lower.includes("purchase")
  )
    return "purchase";

  if (
    lower.includes("rent") ||
    lower.includes("home loan") ||
    lower.includes("house") ||
    lower.includes("flat") ||
    lower.includes("property")
  )
    return "housing";

  return "other";
}
