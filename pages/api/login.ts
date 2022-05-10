import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore
import bcrypt from "bcrypt";

import { sessionOptions } from "../../lib/session";
import { prisma } from "../../lib/prisma";

import type { User } from "./user";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;

  // if a required field is missing, respond with bad request
  if (!(typeof username === "string") || !(typeof password === "string")) {
    return res.status(400).json({
      message: "Required fields: username, password",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (user && passwordCorrect) {
      req.session.user = {
        isLoggedIn: true,
        username: user.username,
        id: user.id,
      } as User;

      await req.session.save();
      res.status(200).json({ message: "Login successful." });
    } else {
      res.status(401).json({ message: "Invalid username or password." });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
