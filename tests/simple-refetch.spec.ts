import { expect, test } from "@playwright/test";

test("Repeat Refetch Data", async ({ page }) => {

  await page.goto("/");
  await expect(page.locator("table")).toBeVisible();

  const iterations = 1000;

  for (let i = 0; i < iterations; i++) {
    console.log(`Iteration ${i + 1}/${iterations}`);
    // Click Refetch Data button
    await page.getByTestId("refetch-button").click();
  }

  console.log(`✅ Completed ${iterations} iterations without errors`);
});
