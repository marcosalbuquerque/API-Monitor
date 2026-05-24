import { useEffect, useState } from 'react';
import Header from './components/Header'

function App() {
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

return (
    <div className="min-h-screen bg-main-background text-main-text transition-colors duration-200">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="mx-auto max-w-7xl p-6">
        <div className="bg-card-background border border-border p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">Texto Exemplo de Título</h2>
          <p className="text-secondary-text mt-1"> Texto Exemplo de Descrição </p>
        </div>
      </main>
    </div>
  );
}

export default App
