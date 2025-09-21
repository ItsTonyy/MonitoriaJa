import './App.css';
import DetalhesMonitor from '../detalhesMonitor/DetalhesMonitor';
import Footer from './components/footer';
import ResponsiveAppBar from './components/AppBar';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <DetalhesMonitor />
      <Footer />
    </div>
  );
}

export default App;
