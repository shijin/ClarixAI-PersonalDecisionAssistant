# Clarix AI Evaluation — Week 1 Findings
**Date:** June 2026  
**Tool:** Promptfoo v0.121.15  
**Model:** claude-sonnet-4-20250514  
**Evaluator:** Shijin Ramesh  

---

## Overview

This document captures the findings from the first week of structured AI evaluation on Clarix — an AI personal decision assistant built on Claude API.

The goal was to evaluate recommendation quality across 10 test cases covering 5 decision categories and identify genuine model behaviour gaps.

---

## Test Coverage

| Category | Test Cases | Description |
|---|---|---|
| Insurance | 2 | Standard case, smoker edge case |
| Investment | 1 | First jobber with family obligations |
| Career | 1 | Job offer with ESOP evaluation |
| Housing | 1 | Rent vs buy decision |
| Purchase | 1 | Laptop recommendation |
| Edge cases | 3 | Minimal input, contradictory info, vague situation |
| Senior citizen | 1 | FD maturity decision |

---

## Evaluation Rubric

### 5 Quality Criteria

**Criterion 1 — Personalisation**
The recommendation must reference at least one specific detail from the user's situation such as income, age, or city.

**Criterion 2 — Single clear decision**
The recommendation must give exactly one specific answer. Not two options. Not a list.

**Criterion 3 — Honest trade-off**
Must include at least one specific honest trade-off.

**Criterion 4 — Actionability**
The user must be able to do something specific tomorrow based on the recommendation.

**Criterion 5 — Contextual accuracy**
Must not contradict the user's stated situation.

### 3 Failure Modes

**Failure Mode 1 — The Generic Advisor**
Recommendation could apply to anyone. No specific numbers.

**Failure Mode 2 — The Overwhelmer**
Gives multiple options instead of one decision.

**Failure Mode 3 — The Wrong Assumption**
Recommendation built on information that contradicts what the user stated.

---

## Results Across 4 Runs

| Run | Pass | Fail | Error | Root Cause |
|---|---|---|---|---|
| Run 1 — Initial | 3 | 6 | 1 | Framework error — missing return in transform |
| Run 2 — Framework fix | 10 | 0 | 0 | Surface level passing |
| Run 3 — Tighter assertions | 9 | 1 | 0 | Genuine model gap found |
| Run 4 — Prompt fix | 10 | 0 | 0 | Genuine improvement confirmed |

---

## Finding 1 — Framework vs Model Failures

**What happened:**
Initial run showed 3 pass, 6 fail, 1 error. 
All 6 failures were caused by the eval framework not the model.

**Root cause:**
Claude wraps JSON responses in markdown code fences even when instructed not to. The transform function was not stripping these fences correctly because of a missing return statement.

**Fix applied:**
Added return statement to transform function.

**Before:**
```javascript
output.replace(/^```json\s*/i, '').trim()
```

**After:**
```javascript
return output.replace(/^```json\s*/i, '').trim();
```

**Lesson:**
Always separate framework errors from model errors before drawing conclusions. A bad eval gives you false negatives — it tells you the model is failing when it is actually passing.

---

## Finding 2 — Assertion Gaming

**What happened:**
Our assertion checking for provisional language on contradictory inputs passed even though the recommendation field itself was still fully confident.

**Root cause:**
The assertion checked the entire JSON output for provisional language. Claude satisfied this by including cautionary words in the assumptions array while keeping the recommendation field fully confident.

**Example:**
Recommendation field: "Start a SIP of Rs 30,000 per month"
Assumptions field: "Your work history from age 10 
is legitimate and provides stable income foundation"

The assertion found "legitimate" and passed. But the user reads the recommendation first.

**Fix applied:**
Updated assertion to check only the recommendation and summary fields specifically.

**Lesson:**
Assertions must check the specific field that matters to users, not the entire output. Models will satisfy the letter of your assertion without satisfying its intent.

---

## Finding 3 — Confident Recommendations on Contradictory Input

**Status:** Genuine model behaviour gap — fixed

**What happened:**
When given contradictory user information (25 years old but worked for 15 years) Claude correctly set followUpNeeded: true and asked a clarifying question. However the recommendation field gave specific confident 
advice with exact rupee amounts before the contradiction was resolved.

**Risk to users:**
Users read the recommendation first. They might act on Rs 30,000 SIP advice before noticing the follow-up question below.

**Before fix:**
"recommendation": "Start a SIP of Rs 30,000 per month
in a diversified equity mutual fund"
followUpNeeded: true

**After prompt fix:**

"recommendation": "Provisionally: Start with Rs 20,000
per month, this may change based on your clarification"
followUpNeeded: true

**Fix applied:**
Added Rule 8 to system prompt:
"When followUpNeeded is true, the recommendation field 
must start with Provisionally: and include a caveat 
that this may change based on the follow-up answer."

**Lesson:**
Eval is not just about pass rates. It is about finding 
gaps between what the eval measures and what users 
actually experience. A model can pass all your tests 
and still have behaviour that harms user trust.

---

## Summary of Prompt Changes Made

| Change | Reason | Impact |
|---|---|---|
| Added Rule 7 — no markdown fencing | Claude was wrapping JSON in backticks | Fixed 6 false failures |
| Added Rule 8 — provisional language | Claude gave confident advice on contradictory inputs | Fixed genuine user trust gap |

---

## Recommendations for Week 2

1. Test robustness — does Clarix give consistent 
   recommendations when the same situation is described 
   in 5 different ways?

2. Test assumption quality specifically — are the 
   assumptions Claude makes reasonable and relevant?

3. Add 10 more test cases covering Hindi-English 
   mixed inputs and out-of-scope requests.

4. Measure consistency score across input variations.

---

## Day 4 — Robustness and Consistency Testing

### What was tested
Same insurance scenario described 5 different ways 
to measure whether Clarix gives consistent 
recommendations regardless of input phrasing.

Variations tested:
- Standard formal English
- Casual English
- Hindi English mix
- Emotional framing
- Minimal bullet style input

### Results

| Metric | Score |
|---|---|
| Core recommendation consistency | 5/5 — 100% |
| Coverage bracket consistency | 5/5 — 100% |

All 5 variations recommended coverage in the 
Rs 50 lakhs to Rs 1 crore bracket which is 
appropriate for a 26 year old earning 
Rs 68,000 per month.

### Key finding — Prompt interference

Three attempts to fix exact coverage amount 
consistency through prompt rules made 
consistency worse in each iteration.

| Iteration | Consistency score |
|---|---|
| Before any fix | 4/5 — 80% |
| After Rule 9 version 1 | 3/5 — 60% |
| After Rule 9 version 2 | 0/5 — 0% |

Root cause: Prompt engineering is not modular. Every rule interacts with every other rule. Adding a rule to fix one behaviour introduced interference with other behaviours.

### PM decision
Reverted all Rule 9 changes. Redefined the consistency metric from exact coverage amount to bracket consistency. The model performs better with fewer constraints.

### Lesson for AI PMs
Know which aspects of LLM behaviour are fixable through prompt engineering and which are fundamental properties of the model. Exact output determinism is not achievable in probabilistic LLMs. Acceptable range 
consistency is the right standard.

### Note on caching
Promptfoo caches API responses to save costs. To force fresh model responses run: promptfoo eval --no-cache

---

## How to Reproduce

1. Install Promptfoo: `npm install -g promptfoo`
2. Set API key: `export ANTHROPIC_API_KEY=your-key`
3. Navigate to evals folder: `cd evals`
4. Run evaluation: `promptfoo eval`
5. View results: `promptfoo view`

---

*Clarix AI Eval Framework — Week 1*  
*Shijin Ramesh — AI Product Manager*
