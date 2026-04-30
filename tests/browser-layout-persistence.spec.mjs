import { test, expect } from '@playwright/test';

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
}

async function goToWorkflowTab(page, tab) {
  await page.locator(`#researchModeNav .uxTab[data-ux-tab="${tab}"]`).click();
  await expect(page.locator(`#researchModeNav .uxTab[data-ux-tab="${tab}"]`)).toHaveAttribute('aria-selected', 'true');
}

test.describe('v1.0.4 browser layout and persistence hardening', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 950 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 }
  ]) {
    test(`core workflow has no horizontal overflow on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await expect(page.locator('#researchModeNav')).toBeVisible();
      await assertNoHorizontalOverflow(page);
      for (const tab of ['analysis', 'evidence', 'sources', 'quality', 'advanced']) {
        await goToWorkflowTab(page, tab);
        await assertNoHorizontalOverflow(page);
      }
    });
  }

  test('workflow tab selection persists across reload', async ({ page }) => {
    await goToWorkflowTab(page, 'sources');
    await page.reload();
    await expect(page.locator('#researchModeNav .uxTab[data-ux-tab="sources"]')).toHaveAttribute('aria-selected', 'true');
    await goToWorkflowTab(page, 'quality');
    await page.reload();
    await expect(page.locator('#researchModeNav .uxTab[data-ux-tab="quality"]')).toHaveAttribute('aria-selected', 'true');
  });

  test('command center and engine map collapsed state persists across reload', async ({ page }) => {
    await expect(page.locator('#workflowPanel')).toHaveClass(/screenDisciplineCollapsed/);
    await expect(page.locator('#enginePanel')).toHaveClass(/screenDisciplineCollapsed/);

    await page.locator('#workflowPanelToggle').click();
    await page.locator('#enginePanelToggle').click();
    await expect(page.locator('#workflowPanel')).not.toHaveClass(/screenDisciplineCollapsed/);
    await expect(page.locator('#enginePanel')).not.toHaveClass(/screenDisciplineCollapsed/);

    await page.reload();
    await expect(page.locator('#workflowPanel')).not.toHaveClass(/screenDisciplineCollapsed/);
    await expect(page.locator('#enginePanel')).not.toHaveClass(/screenDisciplineCollapsed/);

    await page.locator('#workflowPanelToggle').click();
    await page.locator('#enginePanelToggle').click();
    await page.reload();
    await expect(page.locator('#workflowPanel')).toHaveClass(/screenDisciplineCollapsed/);
    await expect(page.locator('#enginePanel')).toHaveClass(/screenDisciplineCollapsed/);
  });

  test('primary actions remain visible on first screen', async ({ page }) => {
    await expect(page.locator('#buildPlanBtn')).toBeVisible();
    await expect(page.locator('#screenDisciplineNextAction')).toBeVisible();
    await expect(page.locator('#releaseHealthMetrics')).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
