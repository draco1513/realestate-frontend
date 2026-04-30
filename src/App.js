import { Toaster } from 'react-hot-toast';
import DepartmentList from './components/Department/DepartmentList';

function App() {
  return (
    <>
      <header className="app-header" role="banner">
        <span className="logo-text">RealEstate</span>
      </header>

      <main>
        <DepartmentList />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            borderRadius: 8,
            border: '1px solid #e2e6ed',
            boxShadow: '0 4px 12px rgba(0,0,0,.10)',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
    </>
  );
}

export default App;
