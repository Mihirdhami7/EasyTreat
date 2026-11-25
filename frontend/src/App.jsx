import './App.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './layout/mainlayout';
import AntdThemeProvider from './components/ui/AntdThemeProvider';

function App() {
  return (
    <AuthProvider>
      <AntdThemeProvider>
        <Layout />
      </AntdThemeProvider>
    </AuthProvider>
  );
}

export default App;
