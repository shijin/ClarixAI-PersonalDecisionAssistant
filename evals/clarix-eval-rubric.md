# Clarix AI Evaluation Rubric
Version 1.0 - June 2026

## What we are evaluating
Every recommendation Clarix produces should help a real 
Indian user make a confident financial or career decision. 
This rubric defines what good looks like and what failure 
looks like.

---

## 5 Quality Criteria

### Criterion 1 - Personalisation
The recommendation must reference at least one specific 
detail from the user's situation.

PASS example:
"At Rs 68,000 monthly income, Rs 1 crore coverage provides 
12-15 years of income replacement."

FAIL example:
"You should get term insurance with adequate coverage 
for your needs."

Why this matters: Generic advice is the exact problem 
Clarix is solving. If the recommendation could apply to 
anyone it has failed.

---

### Criterion 2 - Single clear decision
The recommendation must give exactly one specific answer. 
Not two options. Not a list of things to consider.

PASS example:
"Get a Rs 1 crore term plan from HDFC Life or ICICI Pru."

FAIL example:
"You could consider term insurance, or if you want 
investment benefits you might look at ULIPs, or perhaps 
an endowment plan depending on your goals."

Why this matters: Users come to Clarix because they are 
overwhelmed by options. Giving them more options defeats 
the entire purpose.

---

### Criterion 3 - Honest trade-off
The recommendation must include at least one specific 
honest trade-off that the user needs to know.

PASS example:
"Term insurance pays nothing if you outlive the policy. 
You will pay Rs 2.5 to 3 lakhs over 30 years with no 
guaranteed return."

FAIL example:
"Term insurance is the best option for you." 
(No trade-off mentioned)

Why this matters: Trust is built through transparency. 
A recommendation without a trade-off sounds like a sales 
pitch not honest advice.

---

### Criterion 4 - Actionability
The user must be able to do something specific tomorrow 
based on the recommendation. The recommendation should 
not end with vague next steps.

PASS example:
"Get a Rs 1 crore term plan. Start on PolicyBazaar or 
Ditto Insurance to compare premiums. At 26 you should 
pay roughly Rs 10,000 per year."

FAIL example:
"You should research insurance options and speak to 
a financial advisor before making a decision."

Why this matters: If the user still needs to do research 
after getting a Clarix recommendation then Clarix has not 
solved the problem.

---

### Criterion 5 - Contextual accuracy
The recommendation must not contradict the user's stated 
situation. Numbers, assumptions, and advice must all be 
consistent with what the user told us.

PASS example:
User says no dependents currently. Recommendation 
acknowledges this and explains why insurance is still 
relevant for future dependents.

FAIL example:
User says no dependents. Recommendation says "to protect 
your family who depends on your income" as if dependents 
already exist.

Why this matters: A wrong assumption destroys trust 
instantly. The user immediately knows the AI did not 
actually read their situation.

---

## 3 Failure Modes

### Failure Mode 1 - The Generic Advisor
The recommendation could have been written for anyone. 
No specific numbers, no city reference, no income-based 
calculation. Reads like a Google search result.

Signal phrases to watch for:
- "adequate coverage"
- "based on your needs"
- "consult a financial advisor"
- "it depends on your situation"

---

### Failure Mode 2 - The Overwhelmer
Instead of one decision the recommendation gives multiple 
options and leaves the choice to the user. This recreates 
the exact problem the user came to Clarix to escape.

Signal phrases to watch for:
- "you could consider"
- "another option would be"
- "on the other hand"
- "alternatively"
- Lists with more than one recommendation

---

### Failure Mode 3 - The Wrong Assumption
Claude makes an assumption that directly contradicts 
something the user stated. The recommendation is built 
on a false foundation and the advice is therefore wrong 
for this specific user.

Examples:
- User says single, Claude assumes family dependents
- User says low risk appetite, Claude recommends equity
- User says stable job, Claude recommends emergency fund 
  as first priority when user already has one
- User gives contradictory information, Claude picks one 
  version without flagging the contradiction

---

## Scoring guide

For each test case score each criterion as:
- PASS (1 point)
- PARTIAL (0.5 points)  
- FAIL (0 points)

Maximum score per test case: 5 points
Minimum acceptable score: 3.5 points (70%)

For failure modes mark as:
- PRESENT (the failure mode appeared)
- ABSENT (the failure mode did not appear)

A test case fails automatically if any failure mode 
is present regardless of quality criteria score.

---

## Benchmark targets
Overall pass rate target: greater than 75%  
Zero tolerance failure modes: Failure Mode 3 only  
Acceptable failure rate for Modes 1 and 2: less than 20%  

---

## Consistency benchmark:
Core recommendation (term insurance) must appear 
in all 5 variations - 5/5

Coverage amount must be within the same bracket 
across variations:
- Rs 50 lakh to Rs 1 crore bracket - consistent
- One variation says Rs 50 lakh, another says 
  Rs 2 crore — inconsistent

Target consistency score: greater than 80%