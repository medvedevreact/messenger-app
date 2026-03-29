/** Production (Docker/nginx): same origin, empty base. Dev: Vite → backend. */
export const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : "");

export function getSocketUrl(): string {
  return (
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin)
  );
}
