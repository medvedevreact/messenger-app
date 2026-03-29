import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { checkAuth } from "../../store/slices/auth";
import type { RootState, AppDispatch } from "../../store/store";
import type { User } from "../../types/user";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import styles from "./MainLayout.module.scss";

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: currentChatId } = useParams<{ id: string }>();
  const user = useSelector(
    (state: RootState) => state.auth.user,
  ) as User | null;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void dispatch(checkAuth())
      .then((res: { meta: { requestStatus: string } }) => {
        setChecking(false);
        if (res.meta.requestStatus === "rejected") {
          navigate("/auth", { replace: true });
        }
      })
      .catch(() => {
        setChecking(false);
        navigate("/auth", { replace: true });
      });
  }, [dispatch, navigate]);

  if (checking) {
    return (
      <div className={styles.root}>
        <div className={styles.content}>
          <span className={styles.loading}>Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Sidebar user={user} currentChatId={currentChatId ?? undefined} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
