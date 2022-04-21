import styles from "../styles/Verify.module.sass";
import React, { FC, useEffect, useState } from "react";
import useDebounce from "../lib/useDebounce";
import { MessageType } from "../pages/sign-up/[signupKey]";
import Button, { ArrowLeftIcon, CheckIcon } from "./Button";

interface CreatePasswordProps {
  signupKey: string;
  username: string;
  password: string;
  recoveryEmail: string;
  setRecoveryEmail: (password: string) => void;
  setPage: (page: number) => void;
}

const CreateRecoveryEmail: FC<CreatePasswordProps> = (props) => {
  const {
    signupKey,
    username,
    password,
    recoveryEmail,
    setRecoveryEmail,
    setPage,
  } = props;

  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [message, setMessage] = useState<string>(
    "This address can be used to recover your account if you forget your password."
  );

  const debouncedRecoveryEmail = useDebounce(recoveryEmail, 750);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const requestBody = JSON.stringify({
      signupKey: signupKey,
      username: username,
      password: password,
      email: recoveryEmail,
    });

    setIsLoading(true);

    fetch("/api/createUser", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          setPage(4);
        }
        return response.json();
      })
      .then((result) => {
        setIsLoading(false);
        setMessage(result.message);
      })
      .catch((error) => {
        setIsLoading(false);
        setMessageType("error");
        setMessage("Failed to reach the backend server.");
      });
  };

  // shows an error message only after the user has stopped typing
  useEffect(() => {
    if (debouncedRecoveryEmail) {
      const validatorExpression =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
      const emailIsValid = validatorExpression.test(debouncedRecoveryEmail);

      if (debouncedRecoveryEmail.toLowerCase().endsWith("tuni.fi")) {
        setMessageType("error");
        setMessage(
          "This email will be connected to your account. Using your TUNI address is a bad idea."
        );
        setButtonIsDisabled(true);
      } else if (emailIsValid) {
        setMessageType("success");
        setMessage("Email address is valid.");
        setButtonIsDisabled(false);
      } else {
        setMessageType("error");
        setMessage("Please enter a valid email address.");
        setButtonIsDisabled(true);
      }
    } else {
      setMessageType("info");
      setMessage(
        "This address can be used to recover your account if you forget your password."
      );
      setButtonIsDisabled(false);
    }
  }, [debouncedRecoveryEmail]);

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <label className={styles.label} htmlFor={"recoveryEmail"}>
          Recovery Email (optional)
        </label>
        <input
          className={styles.input}
          id={"recoveryEmail"}
          type={"email"}
          value={recoveryEmail}
          onChange={(event) => {
            setRecoveryEmail(event.target.value);
            event.target.value && setButtonIsDisabled(true);
          }}
        />
        <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>

        <div className={styles.buttonContainer}>
          <Button
            role={"button"}
            isDisabled={false}
            text={"Go back"}
            icon={<ArrowLeftIcon />}
            iconPosition={"left"}
            onClick={() => setPage(2)}
          />
          <Button
            role={"submit"}
            isDisabled={buttonIsDisabled}
            isLoading={isLoading}
            text={"Submit"}
            icon={<CheckIcon />}
            iconPosition={"right"}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateRecoveryEmail;
