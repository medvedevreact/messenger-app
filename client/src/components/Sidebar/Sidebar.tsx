import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import styles from "./Sidebar.module.scss";
import { logoutUser } from "../../store/slices/auth";
import { searchUsers } from "../../api/users";
import {
  getAllConversations,
  createConversation as createConversationApi,
} from "../../api/conversations";
import type { SearchUser, User } from "../../types/user";
import { ChatList } from "../ChatList/ChatList";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/originals/a7/20/80/a720804619ff4c744098b956307db1ff.jpg";

interface SidebarProps {
  user: User;
  currentChatId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentChatId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    isError: conversationsError,
    error: conversationsQueryError,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations", user?.id ?? user?._id],
    queryFn: async () => {
      const data = await getAllConversations();
      return data ?? [];
    },
    enabled: !!user,
    retry: 3,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        searchUsers(q).then(setUsers);
      }, 300),
    [],
  );

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setUsers([]);
      return;
    }
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const createConversationMutation = useMutation({
    mutationFn: (participantId: string) => createConversationApi(participantId),
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({
          queryKey: ["conversations", user?.id ?? user?._id],
        });
        navigate(`/chat/${res._id}`);
        setSearchQuery("");
        setUsers([]);
      }
    },
  });

  const handleCreateConversation = async (participantId: string) => {
    try {
      await createConversationMutation.mutateAsync(participantId);
    } catch (error) {
      console.error("Ошибка создания чата:", error);
    }
  };

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const sidebarLeft = sidebarRef.current.getBoundingClientRect().left;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= 250 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  return (
    <div
      className={styles.root}
      style={{ width: sidebarWidth }}
      ref={sidebarRef}
    >
      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => startResizing(e)}
      ></div>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Найти пользователя..."
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {users.length > 0 && (
          <ul className={styles.searchDropdown}>
            {users.map((u) => (
              <li
                onClick={() => handleCreateConversation(u._id)}
                key={u.email}
                className={styles.searchItem}
              >
                <img
                  src={DEFAULT_AVATAR}
                  alt=""
                  className={styles.searchItemAvatar}
                />
                <span className={styles.searchItemLabel}>{u.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {conversationsLoading ? (
        <div
          className={styles.spinnerWrap}
          aria-busy="true"
          aria-label="Загрузка чатов"
        >
          <div className={styles.spinner} />
        </div>
      ) : conversationsError ? (
        <div className={styles.errorWrap} role="alert">
          <p className={styles.errorText}>
            {conversationsQueryError instanceof Error
              ? conversationsQueryError.message
              : "Не удалось загрузить чаты"}
          </p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => refetchConversations()}
          >
            Повторить
          </button>
        </div>
      ) : (
        <ChatList
          conversations={conversations}
          currentChatId={currentChatId}
          user={user}
          onChatSelect={(chat) => navigate(`/chat/${chat._id}`)}
        />
      )}
      <div className={styles.userBlock}>
        <div className={styles.userInfo}>
          <img src={DEFAULT_AVATAR} alt="avatar" />
          <span>{user.email}</span>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          onClick={() => {
            dispatch(logoutUser());
            navigate("/auth");
          }}
        >
          Выйти из аккаунта
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
};
