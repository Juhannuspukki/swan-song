import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import sendEmail from "../../lib/sendVerificationEmail";
import * as crypto from "crypto";

// POST /api/post
// required fields in body: email

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  // delete unverified emails with accounts older than 24 hours
  const date = new Date(Date.now() - 86400 * 1000).toISOString();

  const deleted = await prisma.email.deleteMany({
    where: {
      createdAt: {
        lt: date,
      },
      signupKey: { not: null },
    },
  });

  // for handling bad requests
  if (!email) {
    return res.status(400).json({
      message: "Required field: email was not found",
    });
  }

  const validatorExpression =
    /^[a-zA-Z0-9_.-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?((tuni|student.tuni)\.fi)$/g;

  // if email does not conform to regex, send error
  if (!validatorExpression.test(email)) {
    return res.status(403).json({
      message:
        "Provided email address is malformed or does not belong to university TLD.",
    });
  }

  try {
    // -- successful response --

    const signupKey = crypto.randomBytes(64).toString("hex");

    const result = await prisma.email.create({
      data: {
        email: email,
        signupKey: signupKey,
      },
    });

    // const verificationEmail = await sendEmail(email, signupKey);

    return res.status(201).json(result);

    // -- end of successful response --
  } catch (e) {
    // -- unsuccessful response --

    // this line tests if the response is one Prisma recognizes
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 means this user already exists
      if (e.code === "P2002") {
        return res.status(409).json({
          message: "Oops, I spoke too soon. This email is already in use.",
        });
      }
    }

    // an unknown error happened
    res.status(500).json({
      message: "An unknown database error has occured.",
    });

    // -- end of unsuccessful response --
  }
}
