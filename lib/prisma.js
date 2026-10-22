import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const url = new URL(connectionString);

const pool = new Pool({
  host: url.hostname,
  port: Number(url.port || 5432),
  database: decodeURIComponent(url.pathname.slice(1)),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
