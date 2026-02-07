module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testPathIgnorePatterns: ["/__tests__/helpers/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(drizzle-orm|@neondatabase)/)",
  ],
};
