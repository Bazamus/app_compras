import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="w-24 h-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Vite + React + Tailwind</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mb-4 w-full transition-colors"
        >
          Contador: {count}
        </button>
        <p className="text-gray-700 mb-4">
          Edita <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> y guarda para probar HMR
        </p>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Haz clic en los logos de Vite y React para aprender más
      </p>
    </div>
  )
}

export default App
