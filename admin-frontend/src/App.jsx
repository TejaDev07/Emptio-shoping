import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminRoutes from './routes/AdminRoutes';
import Notification from './components/Notification';
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Notification />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/*" element={<AdminRoutes />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
