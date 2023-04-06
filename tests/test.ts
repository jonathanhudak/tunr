import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Tunr' })).toBeVisible();
});

test('E3 frequency should make the E3 note have the inTune class', async ({ page }) => {
	await page.evaluate(() => {
		window.navigator.mediaDevices.getUserMedia = () =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			Promise.resolve({
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				getTracks: () => [{ stop: () => {} }],
				active: true
			});
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		window.AudioContext = class {
			constructor() {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				this.sampleRate = 44100;
			}

			createMediaStreamSource() {
				return {
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					connect: () => {}
				};
			}
		};
	});

	await page.waitForSelector('li[data-string="6th"].inTune', {
		timeout: 10000
	});
});
