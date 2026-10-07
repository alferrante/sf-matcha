# Newsletter service setup

The signup service is implemented in `server/newsletter.mjs`. This repository's static site cannot execute a POST handler. Deploy the service separately and set its public URL in the frontend config before presenting signup as working.

## Current launch status

Implementation and automated mock-provider tests are complete. Live subscription is not verified: the private full-access API credential and an authorized hosting workspace are not yet configured. The dedicated SF Matcha segment (`81330e1a-e521-40ab-87ed-220feca6e848`) and string consent properties are established. No contacts or emails were created during implementation. An absent key or segment returns HTTP 503; a static HTML page returning HTTP 200 must never count as signup success.

## Deploy to Render

Create a Node web service from `alferrante/sf-matcha`, using the approved workspace:

- Build command: `npm ci --include=dev`
- Start command: `node server/newsletter.mjs`
- Health check: `/health`
- Plan: free is sufficient for initial integration testing; its cold starts can delay signup. Choose a paid plan only with approval.
- Private environment: `RESEND_API_KEY` with contact-management access, and `RESEND_SEGMENT_ID=81330e1a-e521-40ab-87ed-220feca6e848` for the dedicated SF Matcha newsletter segment. The segment uses established string properties `sfmatcha_consent_at`, `sfmatcha_consent_version`, and `sfmatcha_signup_source`. Do not use an unrelated existing audience or expose the key in `config.js`, the repository, screenshots, or browser code.
- Optional `NEWSLETTER_ALLOWED_ORIGINS`: comma-separated exact origins for staging or local testing. The production apex and `www` HTTPS origins are already allowed. Remove staging origins after testing.
- Keep `NEWSLETTER_TRUST_PROXY` unset unless the host's documented proxy behavior guarantees a trustworthy final `X-Forwarded-For` entry. Without it, the rate limiter uses the direct socket IP; a proxy may therefore share a bucket across visitors. Add an edge rate limit for production abuse protection. The in-memory limit is five submissions per ten minutes per source and resets on restart; it is not shared across service instances.

Set the static site's public `NEWSLETTER_ENDPOINT` to `https://<newsletter-service>.onrender.com/api/newsletter/subscribe`, then rebuild its generated config and deploy. Never set it to the static site's nonexistent `/api` route.

## Browser contract

POST JSON with `{ "email": "reader@example.com", "consent": true, "consentVersion": "2026-10-07", "website": "" }` from an allowed `Origin`. The consent checkbox starts unchecked and explicitly agrees to receive SF Matcha emails. `website` is an invisible honeypot. The client must require both an OK HTTP response and JSON `success === true` before showing success. Use the returned message; the service does not send a confirmation email and must not show “check your inbox.”

This is an explicit single-opt-in capture flow. Existing globally unsubscribed contacts remain opted out, even after submitting again. All accepted requests receive the same generic response so a visitor cannot discover whether an address exists or was unsubscribed. An existing active contact is added only to the dedicated SF Matcha segment. No unrelated segments are edited. Failed provider requests return a generic unavailable message without provider details.

## Privacy, consent and sending

Link the signup form to the site's privacy notice. Explain that email addresses are stored with Resend to deliver SF Matcha updates, that no signup confirmation email is sent by this version, and how a subscriber can request deletion. The service does not log submitted addresses or raw IPs. Rate-limit buckets use salted one-way hashes retained only in memory for ten minutes. Resend maintains its own contact records and infrastructure logs.

Before the first newsletter is sent, configure and verify an SF Matcha sending domain, use only this segment, include the sender identity and mailing address, and include Resend's functioning unsubscribe mechanism in every broadcast. Test unsubscribing with an authorized test address and confirm it stays opted out through this endpoint. This service does not send marketing or confirmation email itself. A separate double-opt-in flow can be added after a verified sender and token storage are available; do not imply address ownership is verified by the current form.

The service persists the latest accepted consent time (server UTC timestamp), policy version (`2026-10-07`) and fixed source (`homepage`) in the dedicated provider properties. Client-supplied timestamps and source labels are ignored. Existing active contacts receive only these property updates and segment membership; global subscription status is not patched. Existing opted-out contacts receive neither update. For a full chronological consent audit, add an append-only event store before expanding acquisition campaigns; the latest properties are not a complete history of repeated changes.

## Verify before marking the milestone live

1. `node --test tests/newsletter.test.mjs` passes.
2. `GET /health` reports `signupConfigured: true` without exposing secrets.
3. Production CORS preflight returns only the requested allowed origin.
4. Verify persistence using a clearly labeled synthetic address under the reserved `example.com` domain, only while no email-sending automation targets the segment; inspect segment membership and consent properties, then delete the synthetic contact. Record this as a synthetic persistence test, not delivery verification. Use a real inbox for delivery testing only when that address is explicitly authorized. Never use someone else's address.
5. Check invalid email, unchecked consent, provider failure and duplicate submissions; no false success or provider details should appear.
6. Confirm frontend HTML fallback, timeout, and missing endpoint produce an honest unavailable state.
7. Record deployment URL and successful live subscription evidence in `SPRINT_SCOREBOARD.md`. Do not report the milestone as complete based only on mocked provider tests.

## Primary API references checked October 7, 2026

- [Create contact, including initial segment membership](https://resend.com/docs/api-reference/contacts/create-contact)
- [Retrieve contact by ID or email, including global unsubscribed state](https://resend.com/docs/api-reference/contacts/get-contact)
- [Update contact properties](https://resend.com/docs/api-reference/contacts/update-contact)
- [Add existing contact to a segment](https://resend.com/docs/api-reference/contacts/add-contact-to-segment)

The service retrieves existing subscription state before writing; it never uses a global resubscribe update.
