/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://mockstardb_owner:tAFwv1QuD4ly@ep-green-leaf-a52kmup0.us-east-2.aws.neon.tech/mockstardb?sslmode=require",
  }
};