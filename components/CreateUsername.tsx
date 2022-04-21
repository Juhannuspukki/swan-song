import styles from "../styles/Verify.module.sass";
import React, { FC, useEffect, useState } from "react";
import useDebounce from "../lib/useDebounce";
import { MessageType } from "../pages/sign-up/[signupKey]";
import { useRouter } from "next/router";
import Button, { ArrowRightIcon } from "./Button";

interface CreateUsernameProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  username: string;
  setUsername: (page: string) => void;
}

const CreateUsername: FC<CreateUsernameProps> = (props) => {
  const { isLoading, setIsLoading, username, setUsername, setPage } = props;

  const router = useRouter();

  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(true);
  const [messageType, setMessageType] = useState<MessageType>("info");
  const [message, setMessage] = useState<string>(
    "Your username will be public, so choose it with care."
  );

  const debouncedUsername = useDebounce(username, 750);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setPage(2);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (username) {
      setIsLoading(true);
    }
    setUsername(event.target.value);
    setButtonIsDisabled(true);
  };

  // send username to be validated after user stops typing
  useEffect(() => {
    if (debouncedUsername) {
      // accept usernames without consecutive, leading or trailing spaces with length of 3-24 characters
      // scandinavian characters, normal characters, numbers and dashes are allowed in the username
      const validatorExpression =
        /^(?!\x20)([öÖäÄåÅ_\-\x20a-zA-Z0-9](?!\x20{2,})(?!\x20$)){3,24}$/g;

      // these are here for more concise error messages
      const allowedCharacters = /^[öÖäÄåÅ_\-\x20a-zA-Z0-9]*$/g;
      const allowedLength = /^(.){3,24}$/g;

      // if email does not conform to regex, send error
      if (debouncedUsername.toLowerCase().includes("drop table")) {
        router.push("https://youtu.be/dQw4w9WgXcQ");
      } else if (!allowedCharacters.test(debouncedUsername)) {
        setMessageType("error");
        setMessage(
          "Please only use characters between A-Ö, numbers, dashes, spaces and underscores."
        );
        setIsLoading(false);
      } else if (!allowedLength.test(debouncedUsername)) {
        setMessageType("error");
        setMessage("Please choose a username between 3 and 24 characters.");
        setIsLoading(false);
      } else if (!validatorExpression.test(debouncedUsername)) {
        setMessageType("error");
        setMessage("Please do not abuse whitespaces.");
        setIsLoading(false);
      } else {
        const requestBody = JSON.stringify({ username: debouncedUsername });
        fetch("/api/validateUsername", {
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
              setButtonIsDisabled(false);
            } else {
              setMessageType("error");
            }
            return response.json();
          })
          .then((result) => {
            setIsLoading(false);
            setMessage(result.message);
          })
          .catch((error) => {
            setMessageType("error");
            setMessage("Failed to reach the backend server.");
          });
      }
    } else {
      setIsLoading(false);
      setMessageType("info");
      setMessage("Your username will be public, so choose it with care.");
    }
  }, [router, debouncedUsername, setIsLoading]);

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={(event) => onSubmit(event)}>
        <label className={styles.label} htmlFor={"username"}>
          Username
        </label>
        <input
          className={styles.input}
          id={"username"}
          type={"text"}
          value={username}
          onChange={(event) => onChange(event)}
        />
        <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>
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

export default CreateUsername;
