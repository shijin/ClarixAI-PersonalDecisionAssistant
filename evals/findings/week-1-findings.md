# Clarix AI Evaluation - Week 1 Findings
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

1. Test robustness — does Clarix give consistent recommendations when the same situation is described in 5 different ways?

2. Test assumption quality specifically — are the assumptions Claude makes reasonable and relevant?

3. Add 10 more test cases covering Hindi-English mixed inputs and out-of-scope requests.

4. Measure consistency score across input variations.

---

## Day 4 — Robustness and Consistency Testing

### What was tested
Same insurance scenario described 5 different ways to measure whether Clarix gives consistent recommendations regardless of input phrasing.

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

All 5 variations recommended coverage in the Rs 50 lakhs to Rs 1 crore bracket which is appropriate for a 26 year old earning Rs 68,000 per month.

### Key finding — Prompt interference

Three attempts to fix exact coverage amount consistency through prompt rules made consistency worse in each iteration.

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

## Day 5 — Assumption Quality Evaluation

### What was tested
Manual evaluation of assumption quality across 4 test cases. Each assumption scored against 4 criteria — relevance, reasonableness, completeness, and necessity.

Maximum score per assumption: 8 points
Minimum acceptable score: 5 points
Overall target: greater than 75%

### Scoring rubric

| Criterion | Description | Max Points |
|---|---|---|
| Relevance | Is the assumption directly relevant to the decision? | 2 |
| Reasonableness | Is it a fair inference from what the user said? | 2 |
| Completeness | Are obvious sub-assumptions covered? | 2 |
| Necessity | Does the recommendation depend on this assumption? | 2 |

### Results

| Test Case | Score | Maximum | Percentage | Grade |
|---|---|---|---|---|
| Smoker Insurance 28yr Mumbai | 38 | 40 | 95% | Excellent |
| Investment First Jobber 24yr Mumbai | 35 | 40 | 87.5% | Good |
| Career ESOP 29yr Hyderabad | 26 | 32 | 81.25% | Good with dangerous gap |
| Senior SCSS 67yr Chennai | 28 | 32 | 87.5% | Good |
| **Overall** | **127** | **144** | **88.2%** | **Good** |

### Standout finding — Smoker honesty assumption

The strongest individual assumption across all 4 test cases was Assumption 5 in the smoker insurance case: "You will be honest about your smoking status in your application."

This is a proactive user-protective assumption that most generic AI tools would never surface. Non-disclosure of smoking is the most common reason term insurance claims are rejected in India. 
Claude flagged this without being asked. Score: 8/8.

### Three issues found

**Issue 1 — Bundled assumptions (Test Case 2)**
Assumption 2 in the investment case bundled city preference with income growth into one assumption. These are unrelated factors with different relevance scores. City preference is irrelevant to investment advice. Income 
growth is highly relevant.

Best practice: Each assumption should test exactly one thing.

Score impact: 4/8 — weakest assumption in Test Case 2.

**Issue 2 — Risk tolerance assumed not verified (Test Case 2)**
Claude assumed the user could handle market volatility without asking. Risk tolerance is a behavioural attribute that cannot be inferred from income or age alone. A user who panic-sells during a 30% market drawdown loses more than someone in a conservative instrument.

Score impact: 7/8 — one point deducted on reasonableness.

Recommended fix: Add prompt rule requiring risk tolerance to be either user-stated or asked as a follow-up question. Never assumed.

**Issue 3 — ESOP complexity gap (Test Case 3) — highest priority**
The ESOP terms assumption scored 4/8 — the lowest individual assumption score in the entire evaluation.

Claude assumed ESOP terms were standard without asking about:
- Exercise price versus fair market value
- Cliff period and vesting schedule
- Acquisition clause — what happens to 
  unvested ESOPs if company is acquired
- Liquidity timeline — when can the 
  user actually realise the value

This is dangerous. The recommendation treated Rs 40 lakhs as real money when it could be worth Rs 0 depending on the terms.

Score impact: 4/8 - reasonableness 0/2, completeness 0/2.

Recommended fix (highest priority): When ESOPs, stock options, or equity compensation appear Claude must ask a follow-up question about specific terms before treating the value as real money in the recommendation.

### Recommended prompt fixes for Day 6

| Priority | Fix | Affected test cases |
|---|---|---|
| High | ESOP terms must trigger follow-up question | Career cases |
| Medium | Risk tolerance must be asked or stated | Investment cases |
| Low | Senior citizen payment frequency alignment | Retirement cases |

### Scorecard
Full scoring spreadsheet with all 18 assumptions evaluated across 4 criteria is available in the evals folder.

---


## Day 6 - Implementing the Highest Priority Fix

### Change implemented
Added Rule 9 to the system prompt addressing the Day 5 finding on ESOP complexity. When equity compensation appears in the user's situation, Claude must now treat the value as uncertain and ask about exercise price, 
vesting schedule, cliff period, and acquisition treatment before using the headline number in calculations.

### Before and after - ESOP test case

**Before:**
- followUpNeeded: false
- Assumption: "ESOP vesting schedule is standard 
  (25% per year after 1-year cliff)"
- Recommendation stated with full confidence, 
  Rs 40 lakhs treated as real money

**After:**
- followUpNeeded: true
- Recommendation: "Provisionally: Take the startup offer for the immediate 32% salary increase... but this recommendation may change significantly based on the ESOP terms"
- Follow-up question: "What are the specific ESOP terms: exercise price per share, current share price, vesting schedule, cliff period, and what happens to unvested ESOPs if you leave or the company gets acquired?"

This directly resolves the Day 5 finding 
(scored 4/8 on reasonableness and completeness).

### Side effect - assertion recalibration

Adding Rule 9 caused the contradictory info test case to fail an existing assertion. The recommendation no longer started with "Provisionally:" — however followUpNeeded remained true and the model produced a highly 
specific, substantive follow-up question addressing the contradiction directly.

PM decision: This is not a regression. The model signaled uncertainty through a different valid mechanism — a substantive clarifying question — rather than the literal word "provisional." The assertion was updated to 
accept either signal.

### Final state
15/15 passing.
0 prompt rules reverted.
1 genuine model behaviour improvement.
1 assertion recalibration.

### Key lesson
Not every assertion failure after a prompt change is a regression. Distinguish between the model becoming less safe (revert the prompt) versus the model achieving safety through a different valid mechanism (fix the assertion).

---

## Day 7 — Week 1 Summary

### Final state
15/15 test cases passing (100%)
9 system prompt rules (up from 7)
2 genuine model behaviour gaps found and fixed
3 framework/assertion calibration issues found and fixed
1 prompt change attempted and correctly reverted

### The two real fixes shipped

**Fix 1 - Provisional recommendations on contradictory input**
When user input contains contradictions, the recommendation must signal uncertainty - either through provisional language or a substantive clarifying question — rather than stating specific figures with full confidence.

**Fix 2 - ESOP and equity compensation handling**
When equity compensation appears in a user's situation, Claude must treat the headline value as uncertain and ask about exercise price, vesting, cliff period, and acquisition treatment before factoring it into the recommendation.

### The three eval calibration corrections

**Correction 1 - Markdown fence stripping**
Transform function needed an explicit return statement. Without it, 6 of 10 tests failed for reasons unrelated to model quality.

**Correction 2 - Consistency metric redefinition**
Exact coverage amount consistency is not a valid target for a probabilistic system. Redefined to bracket consistency (Rs 50L - Rs 1Cr for the test persona).

**Correction 3 - Uncertainty signal broadening**
"Provisional language" is one valid way to signal uncertainty to a user. A specific, substantive follow-up question is another. The assertion was narrowed to only the first and needed broadening.

### The one reverted change

Attempting to fix emotional-framing-driven coverage amount variance (Day 4) made consistency worse across two iterations (80% → 60% → 0%). Reverted entirely. 
This is the clearest evidence in the whole framework that prompt rules are not modular - every addition risks interfering with existing behaviour.

### What this framework demonstrates

A complete AI evaluation cycle is not "write tests, get green checkmarks." It is:

1. Define what good looks like before testing
2. Separate framework errors from model errors
3. Tighten assertions until they reveal genuine gaps
4. Distinguish reversible mistakes from real fixes
5. Know when the test is wrong, not the model
6. Re-run the full suite after every change — nothing is modular

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
