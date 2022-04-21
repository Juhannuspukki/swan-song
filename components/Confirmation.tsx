import styles from "../styles/Confirmation.module.sass";
import React, { FC } from "react";
import { useRouter } from "next/router";
import useTimeout from "../lib/useTimeout";

interface ButtonProps {
  title: string;
  icon: React.ReactNode;
  text: string;
  redirect?: string;
}

export const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.bigIcon}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.bigIcon}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.bigIcon}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Button: FC<ButtonProps> = (props) => {
  const { title, icon, text, redirect } = props;

  const router = useRouter();

  const redirectToPage = () => {
    if (redirect) {
      router.push(redirect);
    }
  };

  useTimeout(redirectToPage, 5000);

  return (
    <div className={styles.centeredContainer}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.iconContainer}>{icon}</div>
      <h2 className={styles.text}>{text}</h2>
    </div>
  );
};

export default Button;
