import dotenv from "dotenv";
import path from "node:path";

// Loaded before any test file (see vitest.config.ts setupFiles), and before
// src/env.ts's own dotenv.config() call — dotenv never overwrites a var
// that's already set, so this pins tests to the cardo_test database.
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
