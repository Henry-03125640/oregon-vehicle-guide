import test from "node:test";
import assert from "node:assert/strict";
import { AGE_GUIDES, FLOWS, JAPAN_OREGON_GUIDES, SOURCES, publicKnowledge } from "../data/knowledge.js";

test("all guide flows contain actionable steps", () => {
  assert.ok(Object.keys(FLOWS).length >= 4);
  for (const flow of Object.values(FLOWS)) {
    assert.ok(flow.label);
    assert.ok(flow.steps.length >= 3);
  }
});

test("all sources are official government HTTPS pages", () => {
  const allowedHosts = new Set(["www.oregon.gov", "www.npa.go.jp", "www.keishicho.metro.tokyo.lg.jp"]);
  for (const source of SOURCES) {
    const url = new URL(source.url);
    assert.equal(url.protocol, "https:");
    assert.ok(allowedHosts.has(url.hostname));
  }
});

test("Japan and Oregon conversion guide covers both directions", () => {
  assert.deepEqual(Object.keys(JAPAN_OREGON_GUIDES), ["japanToOregon", "oregonToJapan"]);
  for (const guide of Object.values(JAPAN_OREGON_GUIDES)) {
    assert.equal(guide.exempt.length, 2);
    assert.ok(guide.requirements.length >= 5);
  }
});

test("public knowledge has a review date", () => {
  assert.match(publicKnowledge().lastReviewed, /^\d{4}-\d{2}-\d{2}$/);
});

test("age guide covers all Class C age groups", () => {
  assert.deepEqual(Object.keys(AGE_GUIDES), ["under15", "age15", "age16to17", "age18to64", "age65plus"]);
  for (const guide of Object.values(AGE_GUIDES)) {
    assert.ok(guide.steps.length >= 3);
    assert.equal(new URL(guide.sourceUrl).hostname, "www.oregon.gov");
  }
});
