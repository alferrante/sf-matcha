import test from 'node:test';
import assert from 'node:assert/strict';
import { newsletterEndpoint, subscribe } from '../lib/newsletter-client.mjs';
test('newsletter accepts safe endpoints and rejects missing, insecure or credential URLs', () => {
  assert.equal(newsletterEndpoint(''), '');
  assert.equal(newsletterEndpoint('https://user:pass@example.com/api'), '');
  assert.equal(newsletterEndpoint('http://example.com/api'), '');
  assert.equal(newsletterEndpoint('javascript:alert(1)'), '');
  assert.equal(newsletterEndpoint('/api/subscribe'), 'https://sanfranciscomatcha.com/api/subscribe');
  assert.equal(newsletterEndpoint('http://localhost:8894/api'), 'http://localhost:8894/api');
});
test('newsletter refuses HTML200, missing acknowledgement and provider errors', async () => {
  const params = {endpoint:'https://example.com/api',email:'reader@example.com',consent:true};
  for (const response of [new Response('<html>SPA fallback</html>'), Response.json({}), Response.json({success:true},{status:503})]) {
    await assert.rejects(subscribe({...params,fetchImpl:async()=>response}), /could not be completed/);
  }
  let called = false;
  await assert.rejects(subscribe({...params,consent:false,fetchImpl:async()=>{called=true}}), /agree/);
  assert.equal(called,false);
});
test('newsletter sends explicit consent and only acknowledges a real success',async()=>{
  let body;
  const message = await subscribe({endpoint:'https://example.com/api',email:' reader@example.com ',consent:true,fetchImpl:async(_,options)=>{body=JSON.parse(options.body);return Response.json({success:true});}});
  assert.equal(body.email,'reader@example.com');
  assert.equal(body.consent,true);
  assert.equal(body.consentVersion,'2026-10-07');
  assert.match(message,/received/);
});
