import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // if user exists, username is not available
    if (user) {
      return res.status(409).json({
        message: "This username is unavailable.",
      });
    } else {
      return res.status(200).json({
        message: "This username is available!",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "An unknown error has occured.",
    });
  }
}
