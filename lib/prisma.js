import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import pg from "pg";
const { Pool } = pg;

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg({
  pool,
});
const prisma = new PrismaClient({ adapter });

export default prisma;
