import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // rickroll the user
  res.writeHead(302, {
    Location: "https://youtu.be/dQw4w9WgXcQ",
  });
  res.end();
}
