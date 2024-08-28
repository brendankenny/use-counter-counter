import {once} from 'node:events';

import puppeteer from 'puppeteer';
import {getFeaturesFromTrace} from './parse-trace.js';

async function captureTrace(url) {
  const browser = await puppeteer.launch({
    // channel: 'chrome-canary',
    waitForInitialPage: true,
    headless: false,
  });
  const page = (await browser.pages())[0];

  await page.tracing.start({
    screenshots: false,
    categories: [
      // Exclude everything except blink.feature_usage.
      '-*',
      'disabled-by-default-blink.feature_usage'
    ]
  });

  if (url) {
    await page.goto(url);
  }

  console.log('When finished, hit enter to stop tracing and close the browser...');
  await once(process.stdin, 'data');

  const encodedTrace = await page.tracing.stop();
  await browser.close();

  const features = getFeaturesFromTrace(encodedTrace);
  if (!features.length) {
    console.log('No use counters were incremented??');
    return;
  }

  console.log('The following features were encountered:');
  for (const feature of features) {
    console.log('  - ', feature);
  }
}

const url = process.argv[2]; 
await captureTrace(url);

process.exit(); // Whatever.
