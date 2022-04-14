import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
// @ts-ignore
import bcrypt from "bcrypt";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, username, password } = req.body;

  console.log(req.body);

  // if a required field is missing, respond with bad request
  if (
    typeof userId === "undefined" ||
    typeof username === "undefined" ||
    typeof password === "undefined"
  ) {
    return res.status(400).json({
      message: "Required fields: userID, username, password",
    });
  }

  try {
    // -- successful response --

    const user = await prisma.email.findUnique({
      where: { id: userId },
    });

    // if this user exists in email table but is not verified yet, create one
    if (user && !user.verified) {
      const hash = await bcrypt.hash(password, 10);

      const [result1, result2] = await prisma.$transaction([
        prisma.user.create({
          data: {
            username: username,
            password: hash,
          },
        }),
        prisma.email.update({
          where: {
            id: userId,
          },
          data: {
            verified: true,
          },
        }),
      ]);

      return res.status(201).json({
        message: "User successfully created",
      });
    } else {
      return res.status(404).json({
        message: "There is no such user id awaiting verification",
      });
    }

    // -- end of successful response --
  } catch (e) {
    // -- error --

    return res.status(500).json({
      message: "An unknown error has occured",
    });

    // -- end of error --
  }
}
