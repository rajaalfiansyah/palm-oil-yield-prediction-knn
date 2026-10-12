import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatasetProvider } from './context/DatasetContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Prediksi from './pages/Prediksi';
import Dataset from './pages/Dataset';
import Metode from './pages/Metode';
import Tentang from './pages/Tentang';

export default function App() {
  return (
    <AuthProvider>
      <DatasetProvider>
        <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/prediksi"
              element={
                <ProtectedRoute>
                  <Prediksi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataset"
              element={
                <ProtectedRoute>
                  <Dataset />
                </ProtectedRoute>
              }
            />
            <Route path="/metode" element={<Metode />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        </BrowserRouter>
      </DatasetProvider>
    </AuthProvider>
  );
}
