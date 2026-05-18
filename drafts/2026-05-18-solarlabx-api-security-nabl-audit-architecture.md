---
title: "Security Architecture for AI-Powered PV Lab Management: API Hardening, Prompt-Injection Guards, and NABL Audit Trails in SolarLabX"
slug: solarlabx-api-security-nabl-audit-architecture
description: "How SolarLabX addresses NABL 121 §4.2 audit traceability and production API security simultaneously — Zod input validation, prompt-injection guards, HMAC relay auth, and CVE hygiene for an AI-native photovoltaic LIMS."
keywords:
  - SolarLabX API security architecture
  - NABL 121 audit traceability AI LIMS
  - LLM prompt injection lab software
  - Zod validation Next.js API routes
  - HMAC authentication SCPI relay
  - NextAuth JWT middleware PV lab
  - AI LIMS security open source
  - IEC 61215 audit trail
  - CVE Next.js hardening PV lab
  - ISO 17025 lab software security
  - Anthropic SDK prompt caching LIMS
  - solar lab API hardening India
  - OWASP LLM Top 10 lab automation
date: 2026-05-18
lastmod: 2026-05-18
author: ganeshgowri-ASA
draft: true
og_image: /og/solarlabx-api-security-nabl-audit-architecture.png
og_image_alt: "Architecture diagram showing SolarLabX security layers: Zod input validation + stripControlChars() at the API boundary, NextAuth JWT middleware for all routes, HMAC relay auth for Surya Yantra calls, and NABL 121 §4.2 audit trail at the data layer"
canonical: https://surya-yantra.srishtipvlab.in/posts/solarlabx-api-security-nabl-audit-architecture
twitter_card: summary_large_image
schema_type: TechArticle
schema_about: Security architecture for AI-native photovoltaic lab management systems with NABL audit compliance
target_venue: Computers & Security (Elsevier) or Journal of Network and Computer Applications
word_count_target: 4500
peer_review_status: outline
seo_focus_keyword: AI LIMS API security NABL audit architecture open source
seed_trigger: SolarLabX PRs #117 and #119 (Mon 2026-05-18) — 5 CVE fixes (CVSS 9.1), Zod on all 5 AI routes, stripControlChars() prompt injection guard, NextAuth middleware, daily audit workflow
weekly_angle: outline
---

# Security Architecture for AI-Powered PV Lab Management: API Hardening, Prompt-Injection Guards, and NABL Audit Trails in SolarLabX

> **Status:** Outline — created 2026-05-18 (Monday outline pass).
> **Engineering trigger:** SolarLabX PR #117 patched 5 CVEs (incl. CVSS 9.1
> Authorization Bypass GHSA-f82v-jwr5-mffw) and added NextAuth JWT middleware;
> PR #119 added Zod validation to all remaining AI/data routes and introduced
> `stripControlChars()` prompt injection mitigation.
> **Research narrative:** AI-native LIMS systems face a dual security surface:
> classical CVE hygiene at the npm/framework layer, and LLM-specific threats
> (prompt injection, token budget exhaustion, AI-generated audit forgery).
> SolarLabX's layered response — CVE patching, input sanitisation, sentinel
> prompt delimiters, HMAC relay auth, and daily audit workflows — is a
> replicable security pattern for any NABL-accredited lab operating AI-assisted
> management software.

---

## §1 — Introduction

### 1.1 The Dual Security Surface of AI-Native LIMS

Traditional LIMS security addresses access control, SQL injection, and database
integrity. Adding an AI layer introduces a second threat surface that must
coexist with the first:

| Threat layer | Traditional LIMS | AI-native LIMS |
|-------------|-----------------|----------------|
| Authentication bypass | Session/JWT guards | Same + LLM identity confusion |
| Input injection | SQL injection → parameterised queries | SQL + **prompt injection** (OWASP LLM01) |
| Audit log integrity | DB transactions | LLM-generated fake audit entries |
| Resource exhaustion | Rate limiting | Token budget exhaustion (OWASP LLM04) |
| Supply chain | npm CVE hygiene | npm CVEs + model provider versioning |
| Data exfiltration | Row-level security | Indirect prompt injection via lab data (OWASP LLM02) |

<!-- TODO: Cite OWASP Top 10 for LLM Applications 2025 (LLM01–LLM10) -->
<!-- TODO: Any published incident of prompt injection in a LIMS or lab context? -->

### 1.2 NABL 121 §4.2 Audit Requirements for AI-Generated Fields

NABL 121:2023 §4.2 requires that all measurement results be traceable to
BIPM-recognised SI units and that the uncertainty estimation process be auditable.
For an AI-assisted LIMS, this creates an additional traceability requirement:
every AI-generated field in a test certificate must be:

- **Reproducible** — same inputs + same model version → same output
- **Attributable** — `model_version` + `request_id` logged alongside the result
- **Separated** from human-verified measurement values
- **Revision-controlled** — model upgrades trigger re-certification of affected documents

<!-- TODO: Confirm whether NABL 121:2023 or NABL 123:2023 governs electronic records -->
<!-- TODO: NABL 123 covers digital measurement records — may be more directly applicable -->

---

## §2 — CVE Hygiene Layer

### 2.1 Critical Vulnerability Landscape — Next.js 14 in Production LIMS

The `next 14.2.18 → 14.2.35` upgrade in PR #117 cleared 5 CVEs and 10+
additional DoS advisories:

| GHSA ID | CVSS | Type | Impact on LIMS |
|---------|------|------|----------------|
| GHSA-f82v-jwr5-mffw | 9.1 | Authorization Bypass in Middleware | Any authenticated route bypassed |
| GHSA-ggv3-7p47-pfv8 | — | HTTP Request Smuggling | Cache poisoning of test results |
| GHSA-4342-x723-ch2f | — | Middleware SSRF Redirect | Internal relay URL exfiltration |
| GHSA-g5qg-72qw-gw5v | — | Image Optimization Cache Confusion | Stale calibration image served |
| GHSA-3h52-269p-cp9r | — | Dev Server Info Disclosure | Source paths leaked in staging |

Additional: `jspdf ^4.2.0→^4.2.1` (PDF Object Injection CVSS 8.1, relevant for
NABL test certificate PDF export), `uuid ^11.0.3→^11.1.1`, `next-auth ^4.24.10→^4.24.14`.

<!-- TODO: Full CVSS scores for GHSA-ggv3-7p47-pfv8, GHSA-4342-x723-ch2f,
     GHSA-g5qg-72qw-gw5v, GHSA-3h52-269p-cp9r from NVD -->

### 2.2 Dependency Management Strategy

<!-- TODO: GitHub Actions daily audit workflow from SolarLabX PR #119
     (`npm audit --audit-level=high`, continues-on-error until Next.js upgrades land) -->

The audit-grade strategy defers `high`-severity issues that require breaking-change
upgrades (tracked as open issues in SolarLabX) while failing the CI on `critical`
vulnerabilities. This mirrors NABL's concept of documented non-conformance with
a remediation plan.

---

## §3 — Input Validation and Prompt-Injection Layer

### 3.1 Zod Route Coverage Before and After PR #117/#119

| Route | Before PR #117 | After PR #119 |
|-------|---------------|---------------|
| `/api/chat` | Zod (PR #116) | Zod ✅ |
| `/api/sop/generate` | None | Zod + `stripControlChars()` ✅ |
| `/api/vision/detect` | None | Zod enum guard ✅ |
| `/api/corrections/apply` | None | Tracked in surya-yantra issue #53 |
| `/api/health` | N/A (GET, no body) | N/A |

The pattern enforces **maximum string lengths** on all user-supplied fields
(e.g., `clause: z.string().max(120)`) to bound the LLM prompt size, preventing
token budget exhaustion (OWASP LLM04).

### 3.2 Prompt-Injection Mitigation: `stripControlChars()` + Sentinel Delimiters

PR #119 introduced two complementary controls on `/api/sop/generate`:

**`stripControlChars(input: string)`** — removes ASCII control characters
(0x00–0x1F, 0x7F) that could be used to inject invisible instructions into
the prompt (e.g., `\x1b[0m` ANSI escape injection).

**Sentinel delimiters** — user input is wrapped in XML-like sentinels before
prompt interpolation:

```
<document_metadata>
  standard: {standard}
  clause: {clause}
</document_metadata>

<additional_context>
{additionalContext}
</additional_context>

Write a PV test SOP section for the above metadata.
```

This tells the model to treat the enclosed content as data, not instructions —
implementing the OWASP LLM01 mitigation pattern for direct prompt injection.

<!-- TODO: Code snippet of the full prompt template showing sentinel usage -->
<!-- TODO: Test case demonstrating that an injected "Ignore previous instructions"
     inside <additional_context> does not change the output (red-team test) -->

### 3.3 Indirect Prompt Injection via Lab Data (OWASP LLM02)

<!-- TODO: This attack vector is not yet mitigated in SolarLabX — file as issue.
     A malicious test protocol name containing "Ignore previous instructions..."
     could be stored in the DB and later retrieved into a `/api/chat` context.
     Mitigation: sanitise all DB-sourced strings with stripControlChars() before
     LLM context insertion. -->

---

## §4 — Authentication and Authorization Layer

### 4.1 NextAuth JWT Middleware (PR #117)

`middleware.ts` applies a JWT guard to all `/api/*` routes except `/api/health`:

- Anonymous callers → HTTP 401 JSON (not redirect — preserves API semantics)
- Authenticated callers → forwarded with original request
- `GET /api/health` → exempted for uptime monitoring / Vercel smoke tests

<!-- TODO: Confirm JWT expiry policy and refresh token rotation strategy -->
<!-- TODO: Does the middleware handle service-to-service calls from Surya Yantra? -->

### 4.2 HMAC-SHA256 Relay Auth (Surya Yantra → SolarLabX)

When SolarLabX calls `POST /api/sessions` on Surya Yantra (or vice versa), the
requests use `x-sy-hmac` HMAC-SHA256 headers with a timestamp claim to prevent
replay attacks:

```typescript
// apps/web/lib/antaryami.ts (surya-yantra issue #29 — not yet scaffolded)
const ts = Date.now().toString();
const hmac = createHmac('sha256', process.env.SY_RELAY_SECRET!)
  .update(`${ts}:${JSON.stringify(body)}`)
  .digest('hex');
```

The same secret must be provisioned in both apps' environment variables, with
documented key rotation procedure.

<!-- TODO: Define HMAC key rotation procedure and add to both DEPLOYMENT.md files -->

---

## §5 — NABL Audit Trail Architecture

### 5.1 Traceability Requirements Mapped to API Response Fields

| NABL 121 requirement | SolarLabX implementation | Status |
|----------------------|-------------------------|--------|
| Measurement traceability to SI | IV data from Surya Yantra with IEC 60891 correction | ✅ via `POST /api/corrections` |
| Uncertainty as `{value, u}` tuples | GUM-compliant response schema | 🟡 Partial (surya-yantra #20) |
| Electronic record integrity | NextAuth JWT + `request_id` header | 🟡 Partial |
| AI-generated content flagged | `model_version` + `cache_read_tokens` in response | 🟡 Scaffolded (PR #112) |
| Auditor access to records | Daily audit GitHub Actions workflow | 🟡 PR #119 (not merged) |
| Model version pinning | `claude-sonnet-4-6` hardcoded | ✅ PR #96 |

### 5.2 Prompt Caching and Audit Reproducibility

PR #112 migrated SolarLabX to `@anthropic-ai/sdk 0.54` with prompt caching on
the 800-token `SOLAR_EXPERT_SYSTEM` constant. The `cache_read_tokens` field in
the response metadata is logged — enabling the audit to confirm whether a
certificate was generated from a cached vs. freshly computed system prompt.

This addresses a subtle NABL traceability question: if the system prompt
changes mid-batch (e.g., cache miss after 5-minute TTL expiry), do the
resulting test certificates differ? With `cache_read_tokens` logged per request,
the auditor can identify any such batch-split.

<!-- TODO: Formalise this as a NABL audit evidence requirement:
     log cache_read_tokens, prompt_hash, and model_version per test certificate -->

---

## §6 — Connections to Ecosystem Security Posture

### 6.1 Antaryami-OS SCPI Safety Layer

The `stripControlChars()` + sentinel delimiter pattern in SolarLabX's
`/api/sop/generate` mirrors the deterministic whitelist in the Surya Yantra
relay (`apps/desktop/relay` — issue #44, #51):

| Layer | Mitigation | Covers |
|-------|-----------|--------|
| SolarLabX API | `stripControlChars()` + Zod | User → LLM boundary |
| Antaryami-OS skill | Sentinel delimiters in SCPI prompts | LLM → command boundary |
| Surya Yantra relay | SCPI command whitelist (JSON, per-verb) | Command → hardware boundary |

Together these implement a three-layer defence-in-depth for AI-controlled
lab instruments, mapping to IEC 62443-4-2 Component Security Levels 1–3.

<!-- TODO: Cross-reference antaryami-os-scpi-safety-governance.md draft for
     the full five-domain safety framework (Authorisation, Audit, Uncertainty,
     Accountability, Override) -->

### 6.2 Shared Security Debt: Indirect Prompt Injection (OWASP LLM02)

All three applications — SolarLabX, Antaryami-OS, Surya Yantra — store
user-generated content (test protocol names, skill invocation logs, module
labels) that could later be retrieved into an LLM context. The
`stripControlChars()` function should be extracted to a shared package
(`packages/types` or a new `packages/security`) and applied consistently
at all DB→LLM context insertion points.

<!-- TODO: File issue in surya-yantra and antaryami-os for shared sanitisation util -->

---

## §7 — Blockers Before Promotion to posts/

- [ ] Full CVE table with CVSS scores from NVD for §2.1
- [ ] `stripControlChars()` + sentinel delimiter code snippet for §3.2
- [ ] Red-team test: confirm sentinel delimiters resist injected "Ignore previous instructions"
- [ ] Indirect prompt injection (OWASP LLM02) analysis and mitigation plan (§3.3)
- [ ] NABL 121 §4.2 vs NABL 123 exact wording for electronic records (§1.2)
- [ ] HMAC key rotation procedure shared with Surya Yantra (§4.2)
- [ ] Daily audit workflow merged and documented (SolarLabX PR #119)
- [ ] OG image: `/og/solarlabx-api-security-nabl-audit-architecture.png` (issue #48 scope)
- [ ] Peer review: security engineer + NABL assessor

---

## References (Outline)

1. NABL 121:2023, *Guidelines for Estimation and Expression of Uncertainty in Measurement*. National Accreditation Board for Testing and Calibration Laboratories, India.
2. OWASP Foundation (2025). *OWASP Top 10 for LLM Applications 2025*. OWASP LLM AI Cybersecurity & Governance Checklist.
3. IEC 62443-4-2:2019, *Security for industrial automation and control systems — Part 4-2: Technical security requirements for IACS components*. Geneva: IEC.
4. ISO 17025:2017, *General requirements for the competence of testing and calibration laboratories*. Geneva: ISO.
5. SolarLabX. *Unified Solar PV Lab Operations Suite: LIMS + QMS + Audit + Test Protocols*. GitHub: ganeshgowri-ASA/SolarLabX, 2026.
6. Surya Yantra. *Srishti PV Module IV Curve Tracer & Test Management System*. GitHub: ganeshgowri-ASA/surya-yantra, 2026.
7. Anthropic (2026). *Prompt Caching Documentation*. Anthropic Developer Docs.

<!-- TODO: Add IEC 62443-3-3 (system-level SL targets) for §6.1 -->
<!-- TODO: Add NIST SP 800-218 (SSDF) for secure development framework reference -->
<!-- TODO: Add jspdf GHSA-7x6v-j9x4-qf24 and GHSA-wfv2-pwc8-crg5 advisory refs -->
