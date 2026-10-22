import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "../lib/prisma.js";
import expressSession from "express-session";

const prismaSessionConfig = expressSession({
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // check expired session every 2 minute
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export default prismaSessionConfig;
