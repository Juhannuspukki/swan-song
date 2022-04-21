import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
// @ts-ignore
import bcrypt from "bcrypt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { signupKey, username, password, email } = req.body;

  // if a required field is missing, respond with bad request
  if (
    typeof signupKey === "undefined" ||
    typeof username === "undefined" ||
    typeof password === "undefined"
  ) {
    return res.status(400).json({
      message: "Required fields: signupKey, username, password",
    });
  }

  if (username.toLowerCase().includes("drop table")) {
    return res.status(418).json({
      message:
        "Table dropped successfully. Please review recovery information here before restarting the server: https://course-o-meter.com/api/recovery",
    });
  }

  try {
    // -- successful response --

    const user = await prisma.email.findUnique({
      where: { signupKey: signupKey },
    });

    // if this user exists in email table and has a verification key, create account
    if (user) {
      const passwordHash = await bcrypt.hash(password, 10);

      // hash the recovery email, just to be sure
      const recoveryEmail =
        typeof email === "undefined" ? null : await bcrypt.hash(email, 10);

      const [result1, result2] = await prisma.$transaction([
        prisma.user.create({
          data: {
            username: username,
            password: passwordHash,
            email: recoveryEmail,
          },
        }),
        prisma.email.update({
          where: {
            signupKey: signupKey,
          },
          data: {
            createdAt: null,
            signupKey: null,
          },
        }),
      ]);

      return res.status(201).json({
        message: "User successfully created.",
      });
    } else {
      return res.status(404).json({
        message: "There is no such user awaiting verification.",
      });
    }

    // -- end of successful response --
  } catch (e) {
    // -- error --

    return res.status(500).json({
      message: "An unknown error has occured.",
    });

    // -- end of error --
  }
}
