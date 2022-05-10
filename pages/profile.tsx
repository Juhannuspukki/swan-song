import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import { User } from "./api/user";

import { InferGetServerSidePropsType } from "next";

export default function SsrProfile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>Your profile</h1>
      <h2>
        This page uses{" "}
        <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
          Server-side Rendering (SSR)
        </a>{" "}
        and{" "}
        <a href="https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props">
          getServerSideProps
        </a>
      </h2>

      <p>
        Want to help with development of Course-O-Matic? Suggest things that
        should be added to this page!
      </p>

      {user?.isLoggedIn && (
        <p style={{ fontStyle: "italic" }}>
          This is your username: {user.username}
        </p>
      )}
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false, username: "", id: "" } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
},
sessionOptions);
