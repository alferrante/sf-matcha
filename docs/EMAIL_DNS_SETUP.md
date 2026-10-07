# SF Matcha email sender verification

Prepared October 7, 2026. Subscriber capture works independently of sender verification. No newsletter or confirmation email has been sent.

The dedicated Resend sending domain is `updates.sanfranciscomatcha.com`, currently **not verified**. Add these provider-generated records to the DNS zone for `sanfranciscomatcha.com`. Names below are relative to that zone; some DNS editors require the full name with `.sanfranciscomatcha.com` appended.

| Type | Name | Value | Priority | TTL |
| --- | --- | --- | --- | --- |
| TXT | `resend._domainkey.updates` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5AdAgZRz86ftYMfitN7kP/uPcxsvnmFg/aVY/DBBPgkyBOB5JNwJD/VV8a/719mNi5zV0Ry5+L3PpWJBIZ4buDiwt52xgMfChG3XSazDC9HB2UMQ8fM0pQVwuBbCif/GbT2Dv5VyBURnlTs3H0UxiJX33nmCd18BHjm4kUuqv5QIDAQAB` | — | Auto |
| MX | `send.updates` | `feedback-smtp.us-east-1.amazonses.com` | 10 | Auto |
| TXT | `send.updates` | `v=spf1 include:amazonses.com ~all` | — | Auto |
| CNAME | `rsend.updates` | `send.forge.rmta.net` | — | Auto |

These are public DNS records, not API credentials. Keep any existing domain mail records intact. Use DNS-only mode for the email CNAME when the DNS host offers proxying.

After records are present, trigger Resend domain verification and check each required record succeeds. Before sending subscriber emails, configure an identified sender, reply contact, postal address, functioning broadcast unsubscribe and approved delivery workflow. Keep open/click tracking disabled. A sender domain alone does not create an inbox or authorize café outreach.

Dedicated domain reference: `ac3cca5d-8f22-475f-83f5-43efac3a424f`. Source: connected Resend's create-domain response on October 7. DNS access is not available in the current deployment connection; no records were changed at the DNS host.
