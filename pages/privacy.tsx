import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.sass";

const Privacy: NextPage = () => {
  return (
    <div className={"container"}>
      <Link href="/" passHref>
        <div>
          <p className={styles.preTitle}>The legendary</p>
          <h1 className={styles.title}>Course-O-Matic</h1>
        </div>
      </Link>
      <h2>Privacy</h2>
      <p>
        The Course-O-Matic system has been designed to guarantee anonymity to
        all users in such a way that even the creator of Course-O-Matic cannot
        determine their identities. However, there are a few things you should
        know about.
      </p>
      <h3>How your email address is used</h3>
      <p>
        Before you can register, the system will ask for your email address to
        ensure that you are a real person and associated with Tuni. The address
        is stored to prevent creation of multiple accounts for shitposting
        purposes and enforcing bans if some disturbed soul decides that this
        would be a great system for selling weed or something. Please sell your
        weed elsewhere.{" "}
      </p>
      <p>
        <strong>
          Your Tuni email address will not be linked to your user account.
        </strong>{" "}
        After you provide your email address, you will receive an email with an
        account creation key. It is completely impossible to know which user
        account is created with that key and the key will be destroyed once the
        account is created.
      </p>
      <h3>Personal data</h3>
      <p>Aside from the email address, no personal data is collected.</p>
      <h3>Ads & tracking</h3>
      <p>Course-O-Matic displays no ads and has no trackers.</p>
      <h3>Cookies</h3>
      <p>
        Course-O-Matic may store cookies or data comparable to cookies on your
        device. These cookies are exclusively used for creating a login session.
        No other cookies are used.
      </p>
      <h3>Contact</h3>
      <p>Go to Tampere and shout for help on Jodel. Channel: TUT</p>
    </div>
  );
};

export default Privacy;
