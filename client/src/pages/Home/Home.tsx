import React from "react";
import { WelcomePanel } from "../../components/WelcomePanel/WelcomePanel";
import styles from "./Home.module.scss";

const Home: React.FC = () => (
  <div className={styles.root}>
    <WelcomePanel />
  </div>
);

export default Home;
