import { test, expect } from '@playwright/test';

const SECRET_LEAK_PATTERNS = [
  /raw_access_token/i,
  /raw_refresh_token/i,
  /access_token\s*[:=]\s*["'][^"']{8,}["']/i,
  /refresh_token\s*[:=]\s*["'][^"']{8,}["']/i,
  /api_key\s*[:=]\s*["'][^"']{12,}["']/i,
  /Bearer\s+[A-Za-z0-9._~+/=-]{12,}/i,
  /sk-[A-Za-z0-9_-]{16,}/i,
  /raw_token_exported\s*[:=]\s*true/i,
  /key_exported\s*[:=]\s*true/i
];

async function assertNoSecretLeak(page) {
  const bodyText = await page.locator('body').innerText();
  for (const pattern of SECRET_LEAK_PATTERNS) {
    expect(bodyText, `Secret-like text leaked into browser UI: ${pattern}`).not.toMatch(pattern);
  }
}

async function selectProvider(page, provider) {
  await page.locator('#providerName').selectOption(provider);
  await expect(page.locator('#providerName')).toHaveValue(provider);
}

async function validateSettings(page) {
  await page.locator('#validateProviderSettingsBtn').click();
  await expect(page.locator('#providerDiagnosticsOutput')).toBeVisible();
}

async function buildDryRun(page) {
  await page.locator('#dryRunProviderRequestBtn').click();
  await expect(page.locator('#providerRunOutput')).toBeVisible();
}

test.describe('v1.0.0 — Provider Mode Browser QA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('provider modes are selectable and remain credential-safe in UI', async ({ page }) => {
    for (const provider of ['mock', 'openai_compatible', 'backend_proxy', 'portable_oauth']) {
      await selectProvider(page, provider);
      await validateSettings(page);
      await assertNoSecretLeak(page);
    }
  });

  test('portable OAuth mock can connect, refresh, dry-run, and render safe diagnostics', async ({ page }) => {
    await selectProvider(page, 'portable_oauth');
    await page.locator('#connectPortableAccountBtn').click();
    await expect(page.locator('#providerDiagnosticsOutput')).toContainText(/connected_mock|portable/i);
    await assertNoSecretLeak(page);

    await page.locator('#refreshPortableAccountBtn').click();
    await expect(page.locator('#providerDiagnosticsOutput')).toContainText(/token:true|connected_mock|portable/i);
    await assertNoSecretLeak(page);

    await buildDryRun(page);
    await expect(page.locator('#providerDiagnosticsOutput')).toContainText(/key_exported:false/);
    await assertNoSecretLeak(page);
  });

  test('BYOK input is never rendered into diagnostics or run ledger UI', async ({ page }) => {
    await selectProvider(page, 'openai_compatible');
    await page.locator('#providerApiKey').fill('sk-browser-secret-must-not-render-1234567890');
    await page.locator('#enableLiveByok').uncheck();
    await buildDryRun(page);
    await page.locator('#runProviderTaskBtn').click();
    await expect(page.locator('#providerRunOutput')).toBeVisible();

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('sk-browser-secret-must-not-render-1234567890');
    await assertNoSecretLeak(page);
  });
});
