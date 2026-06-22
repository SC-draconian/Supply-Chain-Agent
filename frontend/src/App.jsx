import Dashboard from './components/Dashboard';
import WebGLBackground from './components/WebGLBackground';

function App() {
  return (
    <>
      <WebGLBackground />
      <div className="noise" style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px',
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Dashboard />
      </div>
    </>
  );
}

export default App;
