import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Resultados from './pages/Resultados';
import Historial from './pages/Historial';
import Productos from './pages/Productos';
import NotFound from './pages/NotFound';
import Lista from './pages/Lista';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/lista" element={<Lista />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
