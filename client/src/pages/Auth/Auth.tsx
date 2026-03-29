import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, loginUser, registerUser } from "../../store/slices/auth";
import styles from "./Auth.module.scss";
import type { AppDispatch, RootState } from "../../store/store";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const error = useSelector((state: RootState) => state.auth.error);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowError(false);
    dispatch(clearError());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    dispatch(clearError());

    try {
      if (isLogin) {
        await dispatch(loginUser({ email, password })).unwrap();
        navigate("/");
      } else {
        await dispatch(registerUser({ email, password })).unwrap();
        navigate("/");
      }

      console.log({ email, password });
    } catch (error) {
      console.error("Ошибка аутентификации:", error);
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  console.log(showError, error);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          {isLogin ? "Форма входа" : "Форма регистрации"}
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Введите email..."
              autoComplete="off"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Введите пароль..."
              autoComplete="off"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
          {error && showError && <p className={styles.error}>{error}</p>}
        </form>
        <div className={styles.footer}>
          {isLogin ? "Еще нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <span
            className={styles.footerLink}
            onClick={toggleMode}
            role="button"
            tabIndex={0}
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
