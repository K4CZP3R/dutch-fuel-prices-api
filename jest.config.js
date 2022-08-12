/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coverageReporters: ["text", "html"],
	roots: ["<rootDir>/src"],
	testMatch: ["<rootDir>/src/**/*.test.ts"],
};