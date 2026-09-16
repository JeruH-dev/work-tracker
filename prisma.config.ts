import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

loadEnvFile();

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
});
