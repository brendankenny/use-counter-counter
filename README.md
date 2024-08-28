# use-counter-counter

Detemine all the [WebFeature](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/public/mojom/use_counter/metrics/web_feature.mojom)/use counters triggered during a set of actions in a browser tab.

There's not a great way to get these otherwise. You can check `chrome://histograms` and look at the counts way down under `Histogram: Blink.UseCounter.Features`, but you then have to map the IDs there back to feature names, and the counters are mixed with everything else going on in your browser since you last launched.

Instead, this is basically a standalone version of [HTTP Archive's Blink features](https://har.fyi/reference/tables/pages/#features).

Launches a fresh Chrome instance, tracing whatever you do in that browser. On exiting, the `FeatureFirstUsed` trace events are extracted and mapped them back to feature names.

## Run

Clone the repo and enter the directory

- `npm install`
- `npm run start -- https://example.com` (url optional)
- Browser will open, tracing starts immediately (optionally wait for navigation to provided url).
- Do whatever you want in the browser, navigate, open DevTools and mess around, etc.
- **Hit enter on the command line to stop tracing and close the browser** (if you exit the browser otherwise, the trace won't be taken)
- Used features will be logged

Example output for example.com:
```
The following features were encountered:
  -  CSSAtRuleMedia
  -  HasIDClassTagAttribute
  -  SecureContextCheckPassed
```
