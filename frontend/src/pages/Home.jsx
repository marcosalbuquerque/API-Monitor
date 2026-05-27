import { useMemo, useState, useEffect } from "react";

import ReactiveBackground from "../components/ReactiveBackground";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import ApiList from "../components/ApiList";
import Header from "../components/Header";
import useChangeTheme from "../hooks/useChangeTheme";
import { getApis, probeApi } from "../services/api";
import Notification from "../components/Notification";

export default function Home() {
  const { darkMode, setDarkMode } = useChangeTheme();
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [apis, setApis] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadApis() {
      try {
        const data = await getApis();
        if (active) setApis(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load APIs", err);
        if (active) setApis([]);
      }
    }
    loadApis()

    return () => {
      active = false;
    }
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((n) => setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== n.id))
    }, 2500)
    )
    return () => timers.forEach(clearTimeout);
  }, [notifications])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(apis.map((api) => api.category))).filter(Boolean);
    return ["All", ...unique];
  }, [apis])

  const filteredApis = useMemo(() => {
    if (activeCategory === "All") return apis;
    return apis.filter((api) => api.category === activeCategory);
  }, [activeCategory, apis]);

  const pushNotification = (type, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setNotifications((prev) => [{ id, type, message }, ...prev].slice(0, 4));
  };

  const handleTryOut = async (api) => {
    try {
      await probeApi(api.id);
      pushNotification("success", `Request succeeded: ${api.name}`);

    } catch (err) {
      console.error("Probe failed", err);
      const message = err?.response?.data?.message || err?.message || "Request failed";
      pushNotification("error", `${api.name}: ${message}`);
    }
  };

  return (
    <ReactiveBackground>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[340px] flex-col gap-3">
          {notifications.map((n) => (
            <Notification
              key={n.id}
              type={n.type}
              message={n.message}
              onClose={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
            />
          ))}
        </div>
        <Hero />
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />
        <ApiList apis={filteredApis} onTryOut={handleTryOut} />
      </main>
    </ReactiveBackground>
  );
}