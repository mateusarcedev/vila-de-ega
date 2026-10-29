import { expect, test } from "@playwright/test";

test("home keeps the editorial identity and loads the original 3D opening book", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Memórias de Tefé/i, level: 1 })).toBeVisible();
  await expect(page.getByText("Histórias que o tempo não levou.")).toBeVisible();
  const stage = page.locator("[data-opening-book-stage]");
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute("data-opening-mode", /interactive|static/);
  await expect(page.locator('[data-scene-id="tefe-opening-book"] img')).toHaveCount(1);
  await expect(page.locator(".landscape, .city-scene-art, .ega-map, .map-water, .science-river")).toHaveCount(0);
  if (await stage.getAttribute("data-opening-mode") === "interactive") {
    await expect(stage.locator("canvas")).toBeVisible();
  }
});

test("the timeline has no floating side rail and returns to the selected 3D period", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-history-portal="vila-de-ega"]').click();
  await expect(page).toHaveURL(/#vila-de-ega$/);
  await expect(page.locator("#vila-de-ega-title")).toBeVisible();
  await expect(page.getByLabel("Navegação da linha do tempo")).toHaveCount(0);
  const modeSwitch = page.getByRole("group", { name: "Modo de navegação" });
  await modeSwitch.getByRole("button", { name: /Exploração livre/ }).click();
  await expect(page.getByText("Escolha um portal para chegar a uma época", { exact: false })).toBeVisible();
  await expect(modeSwitch.getByRole("button", { name: /Exploração livre/ })).toHaveAttribute("aria-pressed", "true");
  await page.locator("#vila-de-ega").getByRole("link", { name: "Voltar à cronologia 3D ↑" }).click();
  await expect(page).toHaveURL(/#linha-do-tempo$/);
  await expect(page.locator('[data-timeline-marker="vila-de-ega"]')).toHaveAttribute("aria-pressed", "true");
});

test("3D chronology selectors, keyboard navigation and chapter return work", async ({ page }) => {
  await page.goto("/");
  const timeline = page.locator("[data-spatial-timeline]");
  await expect(timeline.locator("[data-timeline-marker]")).toHaveCount(7);
  await page.locator('[data-timeline-marker="vila-de-ega"]').click();
  await expect(page.locator('[data-timeline-marker="vila-de-ega"]')).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Ler este capítulo/ }).click();
  await expect(page).toHaveURL(/#vila-de-ega$/);
  await expect(page.locator("#vila-de-ega-title")).toBeVisible();
  await page.locator("#vila-de-ega").getByRole("link", { name: "Voltar à cronologia 3D ↑" }).click();
  await expect(page).toHaveURL(/#linha-do-tempo$/);
  const ega = page.locator('[data-timeline-marker="vila-de-ega"]');
  await expect(ega).toHaveAttribute("aria-pressed", "true");
  await ega.focus();
  await page.keyboard.press("Enter");
  await expect(ega).toBeFocused();
  await expect(ega).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Ler este capítulo/ }).click();
  await expect(page).toHaveURL(/#vila-de-ega$/);
});

test("guided travel begins at the timeline and portal jumps set direct links", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Iniciar viagem no tempo/i }).click();
  await expect(page.locator("[data-opening-book-stage]")).toHaveAttribute("data-opening-state", "opened", { timeout: 8000 });
  await expect(page).toHaveURL(/#linha-do-tempo$/, { timeout: 8000 });
  await page.locator('[data-timeline-marker="cidade-de-tefe"]').click();
  await page.getByRole("button", { name: /Ler este capítulo/ }).click();
  await expect(page).toHaveURL(/#cidade-de-tefe$/);
  await expect(page.locator("#cidade-de-tefe-title")).toBeVisible();
});

test("event, person and place records have directly addressable pages", async ({ page }) => {
  await page.goto("/historia/vila-de-ega");
  await expect(page.getByRole("heading", { name: "O nome Ega entra no mapa." })).toBeVisible();
  await expect(page.getByText("Reconstrução da Vila de Ega", { exact: true })).toBeVisible();
  await expect(page.getByText("Nenhuma referência bibliográfica foi associada nesta migração.")).toBeVisible();
  await page.goto("/personagens/samuel-fritz");
  await expect(page.getByRole("heading", { name: "Samuel Fritz" })).toBeVisible();
  await page.goto("/lugares/igreja-matriz-santa-teresa");
  await expect(page.getByRole("heading", { name: "Igreja Matriz de Santa Teresa d’Ávila" })).toBeVisible();
  const missing = await page.goto("/historia/nao-existe");
  expect(missing?.status()).toBe(404);
});

test("mobile navigation and the 3D chronology fit the viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Responsive layout assertion is for the mobile project.");
  await page.goto("/");
  const menu = page.locator('button[aria-controls="site-nav"]');
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "A história" })).toBeVisible();
  const timeline = page.locator("[data-spatial-timeline]");
  await timeline.scrollIntoViewIfNeeded();
  await expect(timeline.locator("[data-timeline-marker]")).toHaveCount(7);
  await page.locator('[data-timeline-marker="vila-de-ega"]').click();
  await expect(page.locator('[data-timeline-marker="vila-de-ega"]')).toHaveAttribute("aria-pressed", "true");
  const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test("skip link is keyboard reachable and reduced motion removes smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe("auto");
  await page.locator("[data-spatial-timeline]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-timeline-scene]")).toHaveAttribute("data-display-mode", "static");
});
