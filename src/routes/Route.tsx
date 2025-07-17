import { Routes, Route } from 'react-router-dom';
import ChartPage from '../pages/ChartPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path ="/" element={<div></div>} />
      <Route path="/chart" element={<ChartPage />} />
    </Routes>
  );
}