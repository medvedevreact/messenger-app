import React from "react";
import styles from "./WelcomePanel.module.scss";

export const WelcomePanel: React.FC = () => (
  <div className={styles.root}>
    <h1 className={styles.title}>Добро пожаловать</h1>
    <p className={styles.subtitle}>Выберите чат для общения</p>
  </div>
);
