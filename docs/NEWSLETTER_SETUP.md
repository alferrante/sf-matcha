# Newsletter service setup

The signup service is implemented in `server/newsletter.mjs`. This repository's static site cannot execute a POST handler. Deploy the service separately and set its public URL in the frontend config before presenting signup as working.

## Current launch status

The backend is deployed on Render as `sfmatcha-newsletter` (`srv-db3aelrbc2fs73d4jj40`) at `https://sfmatcha-newsletter.onrender.com`. October 7 verification: `/health` reports configured; allowed-origin preflight succeeds; wrong origins and missing consent are rejected; a reserved synthetic subscription was persisted with consent time/version/source in the dedicated SF Matcha segment. No email was sent. Release `ea5f6e7` passed live browser repeat submission and persisted its latest consent metadata. The form is live. An opted-out synthetic record stayed opted out after a further submission, without its stored consent time changing. The private credential is stored only in the backend environment. An absent key or segment returns HTTP 503; static HTML returning HTTP 200 never counts as signup success.

## Deploy to Render

Create a Node web service from `alferrante/sf-matcha`, using the approved workspace:

- Build command: `npm ci --omit=dev`
- Start command: `node server/newsletter.mjs`
- Health check: `/health`
- Plan: free is sufficient for initial integration testing; its cold starts can delay signup. Choose a paid plan only with approval.
- Private environment: `RESEND_API_KEY` with contact-management access, and `RESEND_SEGMENT_ID=81330e1a-e521-40ab-87ed-220feca6e848` for the dedicated SF Matcha newsletter segment. The segment uses established string properties `sfmatcha_consent_at`, `sfmatcha_consent_version`, and `sfmatcha_signup_source`. Do not use an unrelated existing audience or expose the key in `config.js`, the repository, screenshots, or browser code.
- Optional `NEWSLETTER_ALLOWED_ORIGINS`: comma-separated exact origins for staging or local testing. The production apex and `www` HTTPS origins are already allowed. Remove staging origins after testing.
- For the public Render service, set `NEWSLETTER_TRUST_PROXY=true` and `NEWSLETTER_CLIENT_IP_HEADER=cf-connecting-ip`. Render documents that all public inbound traffic passes through Cloudflare, and Cloudflare recommends its single-IP header for original visitor IPs. This configuration avoids selecting a user-supplied prefix from `X-Forwarded-For` and avoids grouping ordinary visitors under a shared load-balancer IP. Validate at deployment that this header reaches the app and cannot be supplied unchanged by a public client. This is a platform-specific inference from the two providers' documentation, not a guarantee for arbitrary proxies. Do not enable it for a directly reachable server, private callers, or a hosting setup that bypasses Cloudflare. Invalid/missing/multiple IP values fall back to the socket bucket. Without explicit proxy trust, the service always uses the direct socket IP. The alternate `x-forwarded-for` mode trusts only the final valid address and can still group visitors if the final hop is another proxy. Add an edge rate limit for production abuse protection. The in-memory limit is five submissions per ten minutes per source and resets on restart; it is not shared across service instances.

The shipped client defaults to the verified public URL `https://sfmatcha-newsletter.onrender.com/api/newsletter/subscribe`; `NEWSLETTER_ENDPOINT` can override it through generated public config. An explicitly empty value hides the form. No private key is bundled. This fallback also supports the static service's legacy map-only config generator. Never set the endpoint to the static site's nonexistent `/api` route. The client allows up to 60 seconds and displays a saving state to accommodate a free-service cold start; sending to Resend still has an independent short timeout.

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
4. Verify persistence using a clearly labeled synthetic address under the reserved `example.com` domain, only while no email-sending automation targets the segment; inspect segment membership and consent properties, then opt the synthetic contact out and exclude it from audience metrics. Permanent deletion needs separate explicit confirmation; never delete a real contact as test cleanup. Record this as a synthetic persistence test, not delivery verification. Use a real inbox for delivery testing only when that address is explicitly authorized. Never use someone else's address.
5. Check invalid email, unchecked consent, provider failure and duplicate submissions; no false success or provider details should appear.
6. Confirm frontend HTML fallback, timeout, and missing endpoint produce an honest unavailable state.
7. Record deployment URL and successful live subscription evidence in `SPRINT_SCOREBOARD.md`. Do not report the milestone as complete based only on mocked provider tests.

## Primary API references checked October 7, 2026

- [Create contact, including initial segment membership](https://resend.com/docs/api-reference/contacts/create-contact)
- [Retrieve contact by ID or email, including global unsubscribed state](https://resend.com/docs/api-reference/contacts/get-contact)
- [Update contact properties](https://resend.com/docs/api-reference/contacts/update-contact)
- [Add existing contact to a segment](https://resend.com/docs/api-reference/contacts/add-contact-to-segment)

The service retrieves existing subscription state before writing; it never uses a global resubscribe update. Existing active contacts are checked using [List Contact Segments](https://resend.com/docs/api-reference/contacts/list-contact-segments), including up to three cursor pages of 100 entries. Existing members are not redundantly readded. After a needed add, membership is independently read back before success; ambiguous runtime acknowledgments never count as membership evidence. API HTTP 429 responses retry the same operation at most twice, honoring `Retry-After` up to three seconds per wait (one second when absent); longer quota waits return unavailable. The [official Resend OpenAPI](https://github.com/resend/resend-openapi/blob/main/resend.yaml) and prose examples differ on membership acknowledgment shape, so the read-back check is authoritative.

Proxy references: [Render public ingress and DDoS guidance](https://render.com/articles/how-render-handles-ddos-attacks), [Cloudflare original-client headers and XFF behavior](https://developers.cloudflare.com/fundamentals/reference/http-headers/).

## Sending-domain handoff

Dedicated sender `updates.sanfranciscomatcha.com` has been created with open/click tracking disabled. It remains unverified; exact public DNS records and the delivery prerequisites are in [EMAIL_DNS_SETUP.md](EMAIL_DNS_SETUP.md). Capture does not depend on this verification and no messages were sent during testing.
