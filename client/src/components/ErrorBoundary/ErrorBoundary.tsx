import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.scss";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary поймал ошибку:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className={styles.root} role="alert">
          <div className={styles.card}>
            <h2 className={styles.title}>Что-то пошло не так</h2>
            <p className={styles.message}>{this.state.error.message}</p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={this.handleRetry}
              >
                Попробовать снова
              </button>
              <button
                type="button"
                className={styles.reloadBtn}
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
