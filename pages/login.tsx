import { NextPage } from "next";
import useUser from "../lib/useUser";
import React, { useState } from "react";
import { MessageType } from "./sign-up/[signupKey]";
import styles from "../styles/Verify.module.sass";
import Button, { ArrowRightIcon } from "../components/Button";

const Login: NextPage = () => {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: "/profile",
    redirectIfFound: true,
  });

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [message, setMessage] = useState<string>("");

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const requestBody = JSON.stringify({
      username: username,
      password: password,
    });

    fetch("/api/login", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          setMessageType("success");
        } else {
          setMessageType("error");
        }
        return response.json();
      })
      .then((result) => {
        setMessage(result.message);
        mutateUser(result.user, true);
      })
      .catch((error) => {
        setMessageType("error");
        setMessage("Failed to reach the backend server.");
      });
  };

  //aaaaaaaaaaaaaaaa

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>Log in</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <label className={styles.label} htmlFor={"password"}>
          Username
        </label>
        <input
          className={styles.input}
          id={"username"}
          type={"text"}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label className={styles.label} htmlFor={"passwordConfirmation"}>
          Password
        </label>
        <input
          className={styles.input}
          id={"password"}
          type={"password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {messageType !== "info" && (
          <p className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </p>
        )}
        <Button
          role={"submit"}
          isDisabled={false}
          text={"Log in"}
          icon={<ArrowRightIcon />}
          iconPosition={"right"}
          onClick={() => {}}
        />
      </form>
    </div>
  );
};

export default Login;
