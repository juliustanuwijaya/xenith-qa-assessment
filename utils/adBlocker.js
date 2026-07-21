// utils/adBlocker.js

const blockedPatterns = [
  /googlesyndication\.com/,
  /doubleclick\.net/,
  /google-analytics\.com/,
  /adtrafficquality\.google/,
  /adsrvr\.org/,
  /ladsp\.com/,
  /opera\.com/,
  /temu\.com/,
  /google\.co\.id\/ads/,
];

/**
 * Blocks known ad/tracking network requests that interfere with
 * demoqa.com's form behavior (fields clearing on blur due to
 * ad scripts hijacking focus events).
 */
async function blockAds(page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (blockedPatterns.some((pattern) => pattern.test(url))) {
      return route.abort();
    }
    return route.continue();
  });
}

module.exports = { blockAds, blockedPatterns };