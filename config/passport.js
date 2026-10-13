import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

//setting up local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect email or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

//serialization
passport.serializeUser((user, done) => {
  done(null, user.id); //storing user id
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true }, //select role too for future admin access
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
