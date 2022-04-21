import styles from "../styles/Verify.module.sass";
import React, { FC, useEffect, useState } from "react";
import useDebounce from "../lib/useDebounce";
import { MessageType } from "../pages/sign-up/[signupKey]";
import Button, { ArrowLeftIcon, ArrowRightIcon } from "./Button";

interface CreatePasswordProps {
  password: string;
  setPassword: (password: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (passwordConfirmation: string) => void;
  setPage: (page: number) => void;
}

const CreatePassword: FC<CreatePasswordProps> = (props) => {
  const {
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    setPage,
  } = props;

  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(true);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [message, setMessage] = useState<string>(
    "Choose a nice, long password for yourself."
  );

  const debouncedPassword = useDebounce(password, 750);
  const debouncedPasswordConfirmation = useDebounce(passwordConfirmation, 750);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPage(3);
  };

  // shows an error message only after the user has stopped typing
  useEffect(() => {
    if (debouncedPassword) {
      setMessageType("info");
      setMessage("Choose a nice, long password for yourself.");
      setButtonIsDisabled(true);
      if (debouncedPassword.toLowerCase() === "correct horse battery staple") {
        setMessageType("error");
        setMessage("I didn't mean literally!");
      } else if (
        debouncedPassword.length < 16 ||
        debouncedPassword.length > 128
      ) {
        setMessageType("error");
        setMessage(
          `Your password must be between 16 and 128 characters long. Current length: ${
            debouncedPassword.length
          } character${debouncedPassword.length > 1 ? "s" : ""}.`
        );
      } else if (debouncedPasswordConfirmation !== debouncedPassword) {
        setMessageType("error");
        setMessage("Passwords don't match.");
      } else {
        setMessageType("success");
        setMessage("Password is valid.");
        setButtonIsDisabled(false);
      }
    } else {
      setMessageType("info");
      setMessage("Choose a nice, long password for yourself.");
      setButtonIsDisabled(true);
    }
  }, [debouncedPassword, debouncedPasswordConfirmation]);

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <label className={styles.label} htmlFor={"password"}>
          Password
        </label>
        <input
          className={styles.input}
          id={"password"}
          type={"password"}
          value={password}
          minLength={16}
          maxLength={48}
          onChange={(event) => {
            setPassword(event.target.value);
            setButtonIsDisabled(true);
          }}
        />
        <label className={styles.label} htmlFor={"passwordConfirmation"}>
          Confirm Password
        </label>
        <input
          className={styles.input}
          id={"passwordConfirmation"}
          type={"password"}
          value={passwordConfirmation}
          onChange={(event) => {
            setPasswordConfirmation(event.target.value);
            setButtonIsDisabled(true);
          }}
        />
        <p className={`${styles.message} ${styles[messageType]}`}>
          {message}{" "}
          {messageType === "info" && (
            <a
              href={"https://xkcd.com/936/"}
              target={"_blank"}
              rel="noreferrer"
              className={styles.readMore}
            >
              How do I create a stronk password?
            </a>
          )}
        </p>
        <div className={styles.buttonContainer}>
          <Button
            role={"button"}
            isDisabled={false}
            text={"Go back"}
            icon={<ArrowLeftIcon />}
            iconPosition={"left"}
            onClick={() => setPage(1)}
          />
          <Button
            role={"submit"}
            isDisabled={buttonIsDisabled}
            text={"Continue"}
            icon={<ArrowRightIcon />}
            iconPosition={"right"}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePassword;
