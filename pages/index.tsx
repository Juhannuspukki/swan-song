import type { NextPage } from "next";
import Link from "next/link";
import styles from "../styles/Home.module.sass";

const Home: NextPage = () => {
  return (
    <div className={"container"}>
      <Link href="/" passHref>
        <div>
          <p className={styles.preTitle}>The legendary</p>
          <h1 className={styles.title}>Course-O-Matic</h1>
        </div>
      </Link>
      <div className={styles.soonContainer}>
        <h2 className={styles.soon}>SOON™</h2>
        <a
          href={"https://archive.course-o-meter.com"}
          className={styles.soonLink}
        >
          Course-O-Meter archive →
        </a>
        <p>
          <a href={"/verify"} className={styles.soonLink}>
            Create an account (beta) →
          </a>
        </p>
        <p>
          <a href={"/login"} className={styles.soonLink}>
            Log in to your account (alpha) →
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
