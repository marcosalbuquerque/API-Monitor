import { useState, useEffect } from "react";

export default function useChangeTheme() {
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

      return {darkMode, setDarkMode}
}