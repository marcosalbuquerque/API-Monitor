import { useMemo, useState, useEffect } from "react";

import ReactiveBackground from "../components/ReactiveBackground";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import ApiList from "../components/ApiList";
import Header from "../components/Header";
import useChangeTheme from "../hooks/useChangeTheme";
import { getApis, probeApi } from "../services/api";

export default function Home() {
  const { darkMode, setDarkMode } = useChangeTheme();

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

  const categories = useMemo(() => {
    const unique = Array.from(new Set(apis.map((api) => api.category))).filter(Boolean);
    return ["All", ...unique];
  }, [apis])

  const filteredApis = useMemo(() => {
    if (activeCategory === "All") return apis;
    return apis.filter((api) => api.category === activeCategory);
  }, [activeCategory, apis]);

  const handleTryOut = async (api) => {
    try {
      await probeApi(api.id);
      alert(`Try Out: ${api.name}`);
    } catch (err) {
      console.error("Probe failed", err);
      alert(`Probe failed: ${api.name}`);
    }
  };

  return (
    <ReactiveBackground>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
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