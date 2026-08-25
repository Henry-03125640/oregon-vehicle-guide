import test from "node:test";
import assert from "node:assert/strict";
import { authorizeRequest } from "../auth.js";

function request(username, password) {
  const credentials = Buffer.from(`${username}:${password}`).toString("base64");
  return { headers: { authorization: `Basic ${credentials}` } };
}

const environment = {
  REQUIRE_PRIVATE_ACCESS: "true",
  PRIVATE_SITE_USERNAME: "owner",
  PRIVATE_SITE_PASSWORD: "correct horse"
};

test("accepts valid private-site credentials", () => {
  assert.equal(authorizeRequest(request("owner", "correct horse"), environment).authorized, true);
});

test("rejects invalid credentials", () => {
  assert.equal(authorizeRequest(request("owner", "wrong"), environment).authorized, false);
});

test("fails closed when the private password is missing", () => {
  assert.deepEqual(authorizeRequest({ headers: {} }, { REQUIRE_PRIVATE_ACCESS: "true" }), {
    authorized: false,
    configurationError: true
  });
});

test("allows unprotected local development", () => {
  assert.equal(authorizeRequest({ headers: {} }, {}).authorized, true);
});
