import { NextPage } from "next";
import Confirmation, { MailIcon } from "../components/Confirmation";

const Thanks: NextPage = () => {
  return (
    <Confirmation
      title={"Success!"}
      icon={<MailIcon />}
      text={
        "If this email has not been previously registered, an account creation link will be sent your inbox."
      }
    />
  );
};

export default Thanks;
