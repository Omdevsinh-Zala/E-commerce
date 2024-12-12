module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    coverageDirectory: './coverage',
    collectCoverage: true,
}