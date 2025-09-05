import { expect, test } from "@playwright/test";

test("Repeat Refetch Data", async ({ page }) => {
  test.setTimeout(60000);

  await page.goto("/");
  await expect(page.locator("table")).toBeVisible();

  const iterations = 1000;

  for (let i = 0; i < iterations; i++) {
    console.log(`Iteration ${i + 1}/${iterations}`);
    // Click Refetch Data button
    await page.getByTestId("refetch-button").click();
    // Check that no error is displayed - test passes if error doesn't appear
    await expect(page.getByTestId("error-fallback")).not.toBeVisible();
  }

  console.log(`✅ Completed ${iterations} iterations without errors`);
});
