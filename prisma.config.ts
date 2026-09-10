import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
