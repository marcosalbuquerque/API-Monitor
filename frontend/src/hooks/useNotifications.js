import { useCallback, useEffect, useState } from "react";

const DEFAULT_TIMEOUT_MS = 2500;
const DEFAULT_MAX_ITEMS = 4;

export default function useNotifications({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  maxItems = DEFAULT_MAX_ITEMS,
} = {}) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((n) =>
      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      }, timeoutMs)
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, timeoutMs]);

  const pushNotification = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setNotifications((prev) => [{ id, type, message }, ...prev].slice(0, maxItems));
  }, [maxItems]);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { notifications, pushNotification, dismissNotification };
}
