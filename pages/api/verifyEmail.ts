import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import sendEmail from "../../lib/sendVerificationEmail";

const validatorExpression =
  /^[a-zA-Z0-9_.-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(tuni|student.tuni)\.fi$/g;

// POST /api/post
// required fields in body: email

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  // if email dies not conform to regex, send error
  if (!validatorExpression.test(email)) {
    return res.status(403).json({
      message:
        "Provided email address is malformed or does not belong to university TLD",
    });
  }

  try {
    // -- successful response --

    const result = await prisma.email.create({
      data: {
        email: email,
        verified: false,
      },
    });

    const verificationEmail = await sendEmail(email, result.id);

    console.log(verificationEmail);

    return res.status(201).json(result);

    // -- end of successful response --
  } catch (e) {
    // -- unsuccessful response --

    // this line tests if the response is one Prisma recognizes
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 means this user already exists
      if (e.code === "P2002") {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }

    // an unknown error happened
    res.status(500).json({
      message: "An unknown database error has occured",
    });

    // -- end of unsuccessful response --
  }
}
