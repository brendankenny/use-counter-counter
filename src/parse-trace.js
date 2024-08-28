import {featureMap} from './feature-map.js';

// `blink.feature_usage` will log a bunch of `FeatureFirstUsed` events to the
// trace. Check them to get feature IDs, then map them back to feature names.
export function getFeaturesFromTrace(encodedTrace) {
  const decoder = new TextDecoder();
  const traceJson = decoder.decode(encodedTrace);
  const trace = JSON.parse(traceJson);

  const features = new Set();
  for (const event of trace.traceEvents) {
    if (event.name === 'FeatureFirstUsed') {
      const id = event.args.feature;
      const featureName = featureMap[id] || `UnknownFeature_${id}`;

      features.add(featureName);
    }
  }

  return [...features].sort();
}
