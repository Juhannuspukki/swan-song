import { NextPage } from "next";
import Confirmation, { MailIcon } from "../components/Confirmation";

const Thanks: NextPage = () => {
  return (
    <Confirmation
      title={"Success!"}
      icon={<MailIcon />}
      text={"An account creation link has been sent your inbox."}
    />
  );
};

export default Thanks;
