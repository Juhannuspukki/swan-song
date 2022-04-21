import type { NextPage } from "next";
import styles from "../styles/Verify.module.sass";
import React, { ChangeEvent, useEffect, useState } from "react";
import useDebounce from "../lib/useDebounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { MessageType } from "./sign-up/[signupKey]";
import Button, { ArrowRightIcon } from "../components/Button";

const Verify: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [message, setMessage] = useState<string>(
    "Your email address will not be connected to your user account."
  );

  const router = useRouter();

  const updateEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const validatorExpression =
      /^[a-zA-Z0-9_.-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?((tuni|student.tuni)\.fi)$/g;
    setEmail(event.target.value);
    setButtonIsDisabled(!validatorExpression.test(event.target.value));
  };

  const debouncedEmail = useDebounce(email, 750);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const requestBody = JSON.stringify({ email: email });
    setIsLoading(true);
    setButtonIsDisabled(true);
    fetch("/api/verifyEmail", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          router.push({
            pathname: "/thanks",
          });
        } else {
          setMessageType("error");
          setIsLoading(false);
          setButtonIsDisabled(false);
        }
        return response.json();
      })
      .then((result) => {
        setMessage(result.message);
      })
      .catch((error) => {
        setMessageType("error");
        setMessage("Failed to reach the backend server.");
      });
  };

  // shows an error message only after the user has stopped typing
  useEffect(() => {
    // this constant must be defined twice or the whole thing breaks!
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test

    if (debouncedEmail) {
      const validatorExpression =
        /^[a-zA-Z0-9_.-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?((tuni|student.tuni)\.fi)$/g;
      const emailIsValid = validatorExpression.test(debouncedEmail);

      if (emailIsValid) {
        setMessageType("success");
        setMessage(
          "This email is valid. You will receive an email with an account creation link."
        );
      } else {
        setMessageType("error");
        setMessage("Please enter a valid TUNI email address.");
      }
    } else {
      setMessageType("info");
      setMessage(
        "Your email address will not be connected to your user account."
      );
    }
  }, [debouncedEmail]);

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>Verify Email</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <label className={styles.label} htmlFor={"email"}>
          Tuni email address:
        </label>
        <input
          className={styles.input}
          id={"email"}
          type={"email"}
          placeholder={"tuniukko@tuni.fi"}
          value={email}
          onChange={(event) => updateEmail(event)}
        />
        <p className={`${styles.message} ${styles[messageType]}`}>
          {message}{" "}
          {messageType === "info" && (
            <Link href="/privacy" passHref>
              <span className={styles.readMore}>Read more</span>
            </Link>
          )}
        </p>
        <Button
          isDisabled={buttonIsDisabled}
          role={"submit"}
          isLoading={isLoading}
          text={"Continue"}
          icon={<ArrowRightIcon />}
          iconPosition={"right"}
          onClick={() => {}}
        />
      </form>
    </div>
  );
};

export default Verify;
