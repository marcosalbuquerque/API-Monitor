import { useMemo, useState, useEffect } from "react";

import ReactiveBackground from "../components/ReactiveBackground";
import Hero from "../components/Hero";
import CategoryFilter from "../components/CategoryFilter";
import ApiList from "../components/ApiList";
import Header from "../components/Header";

//TODO: Remove this fake data and use the real one in catalog.json

const CATEGORIES = ["All", "Finance", "Weather", "Music", "Tools", "Animals"];

const MOCK_APIS = [
  {
    id: "fin-1",
    name: "Exchange Rates",
    description: "Real-time and historical FX rates with simple endpoints and sane defaults.",
    category: "Finance",
    docsUrl: "#",
  },
  {
    id: "fin-2",
    name: "Open Banking Sandbox",
    description: "Test payments, accounts, and consent flows in a safe, developer-friendly sandbox.",
    category: "Finance",
    docsUrl: "#",
  },
  {
    id: "wea-1",
    name: "HyperLocal Weather",
    description: "Minute-level forecasts, alerts, and air quality for any coordinate worldwide.",
    category: "Weather",
    docsUrl: "#",
  },
  {
    id: "wea-2",
    name: "Climate Normals",
    description: "Seasonal climate normals and long-term summaries to power planning dashboards.",
    category: "Weather",
    docsUrl: "#",
  },
  {
    id: "mus-1",
    name: "Music Catalog",
    description: "Search tracks, artists, and albums with rich metadata and preview clips.",
    category: "Music",
    docsUrl: "#",
  },
  {
    id: "mus-2",
    name: "Audio Features",
    description: "Analyze tempo, energy, danceability, and more for playlists and recommendations.",
    category: "Music",
    docsUrl: "#",
  },
  {
    id: "too-1",
    name: "URL Toolkit",
    description: "Expand, shorten, validate, and inspect URLs with rate limits suitable for apps.",
    category: "Tools",
    docsUrl: "#",
  },
  {
    id: "too-2",
    name: "Text Utilities",
    description: "Slugify, summarize, detect language, and extract entities with fast responses.",
    category: "Tools",
    docsUrl: "#",
  },
  {
    id: "ani-1",
    name: "Animal Facts",
    description: "Cute, educational animal facts and images for demos, learning, and apps.",
    category: "Animals",
    docsUrl: "#",
  },
];

export default function Home() {
  /* TODO: Transform this darkMode change
  in a Hook, so don't need to reuse logic every time...
  */
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  } )

  useEffect(() => { 
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // TODO: Also transform this into a Hook and use it in CategoryFilter component
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredApis = useMemo(() => {
    if (activeCategory === "All") return MOCK_APIS;
    return MOCK_APIS.filter((api) => api.category === activeCategory);
  }, [activeCategory]);

  const handleTryOut = (api) => {
    alert(`Try Out: ${api.name}`);
  };

  return (
    <ReactiveBackground>
      <Header darkMode = {darkMode} setDarkMode = {setDarkMode}  />
      <main>
        <Hero />
        <CategoryFilter categories={CATEGORIES} activeCategory={activeCategory} onChange={setActiveCategory} />
        <ApiList apis={filteredApis} onTryOut={handleTryOut} />
     </main>
    </ReactiveBackground>
  );
}