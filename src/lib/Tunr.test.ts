// const { chromium } = require('playwright');

// describe('Guitar Tuner', () => {
//   let browser;
//   let page;

//   before (guitarNote) => {
//     return page.$...;
//   });

//   beforeAll(async () => {
//     browser = await chromium.launch();
//     page = await browser.newPage();
//     await page.goto('http://localhost:3000'); // Update this URL to match your app's URL
//   });

//   afterAll(async () => {
//     await browser.close();
//   });

//   test('E3 frequency should make the E3 note have the inTune class', async () => {
//     await page.evaluate(() => {
//       window.navigator.mediaDevices.getUserMedia = () =>
//         Promise.resolve({
//           getTracks: () => [{ stop: () => {} }],
//           active: true,
//         });

//       window.AudioContext = class {
//         constructor() {
//           this.sampleRate = 44100;
//         }

//         createMediaStreamSource() {
//           return {
//             connect: () => {},
//           };
//         }
//       };
//     });

//     await page.waitForSelector('li[data-string="6th"].inTune', {
//       timeout: 10000,
//     });
//   });
// });
