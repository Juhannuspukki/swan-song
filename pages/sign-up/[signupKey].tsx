import { NextPage } from "next";
import React, { useState } from "react";
import CreateUsername from "../../components/CreateUsername";
import CreatePassword from "../../components/CreatePassword";
import CreateRecoveryEmail from "../../components/CreateRecoveryEmail";
import { prisma } from "../../lib/prisma";
import Confirmation, {
  ErrorIcon,
  SuccessIcon,
} from "../../components/Confirmation";

export type MessageType = "success" | "info" | "error";

interface SignUpProps {
  startPage: number;
  signupKey: string;
}

const SignUp: NextPage<SignUpProps> = (props) => {
  const { startPage, signupKey } = props;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(startPage);

  switch (page) {
    case 1:
      return (
        <CreateUsername
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          username={username}
          setUsername={setUsername}
          setPage={setPage}
        />
      );
    case 2:
      return (
        <CreatePassword
          password={password}
          setPassword={setPassword}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          setPage={setPage}
        />
      );
    case 3:
      return (
        <CreateRecoveryEmail
          signupKey={signupKey}
          username={username}
          password={password}
          recoveryEmail={recoveryEmail}
          setRecoveryEmail={setRecoveryEmail}
          setPage={setPage}
        />
      );
    case 4:
      return (
        <Confirmation
          title={"Success!"}
          icon={<SuccessIcon />}
          text={"Your account was created successfully."}
          redirect={"/"}
        />
      );
    default:
      return (
        <Confirmation
          title={"Error"}
          icon={<ErrorIcon />}
          text={"This account activation key is invalid."}
        />
      );
  }
};

export const getServerSideProps = async (context: {
  query: { signupKey: unknown };
}) => {
  // show error if signupKey is either malformed or a corresponding email is not found
  if (context.query.signupKey && typeof context.query.signupKey === "string") {
    const posts = await prisma.email.findUnique({
      where: {
        signupKey: context.query.signupKey,
      },
    });
    if (posts) {
      return { props: { startPage: 1, signupKey: context.query.signupKey } };
    }
  }

  // error
  return { props: { startPage: 0, signupKey: "" } };
};

export default SignUp;
