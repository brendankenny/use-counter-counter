import {featureMap} from './feature-map.js';
import {webdxMap} from './webdx-map.js';

const eventNameToLookup = {
  // WebFeature.
  FeatureFirstUsed: {
    lookup: featureMap,
    logPrefix: '',
  },
  // WebDXFeature.
  WebDXFeatureFirstUsed: {
    lookup: webdxMap,
    logPrefix: 'WebDX: ',
  },
};
const targetEventNames = new Set(Object.keys(eventNameToLookup));

// `blink.feature_usage` will log a bunch of feature-first-used events to the
// trace. Check them to get feature IDs, then map them back to feature names.
export function getFeaturesFromTrace(encodedTrace) {
  const decoder = new TextDecoder();
  const traceJson = decoder.decode(encodedTrace);
  const trace = JSON.parse(traceJson);

  const features = new Set();
  for (const event of trace.traceEvents) {
    if (!targetEventNames.has(event.name)) {
      continue;
    }

    const {lookup, logPrefix} = eventNameToLookup[event.name];
    const featureId = event.args.feature;
    const basename = lookup[featureId] || `Unknown${event.name}_${featureId}`;

    features.add(logPrefix + basename);
  }

  return [...features].sort();
}
