import './App.css';
import DetalhesMonitor from '../detalhesMonitor/DetalhesMonitor';
import AgendamentoMonitor from '../detalhesMonitor/AgendamentoMonitor';
import Footer from './components/footer';
import ResponsiveAppBar from './components/AppBar';

function App() {
  const handleVoltar = () => {
    console.log('Voltar clicado');
  };

  const handleAgendar = () => {
    console.log('Agendar clicado');
  };

  return (
    <div className="App">
      <ResponsiveAppBar />
      <AgendamentoMonitor />
      <Footer />
    </div>
  );
}

export default App;
