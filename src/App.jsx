import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewTestPlan from './pages/NewTestPlan';
import Schedules from './pages/Schedules';
import Monitoring from './pages/Monitoring';
import Reports from './pages/Reports';
import TestCatalog from './pages/TestCatalog';
import Runs from './pages/Runs';
import Devices from './pages/Devices';
import Builds from './pages/Builds';
import Settings from './pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="test-plans" element={<NewTestPlan />} />
          <Route path="test-plans/new" element={<NewTestPlan />} />
          <Route path="runs" element={<Runs />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="devices" element={<Devices />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="reports" element={<Reports />} />
          <Route path="builds" element={<Builds />} />
          <Route path="test-catalog" element={<TestCatalog />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
