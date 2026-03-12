import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';

import HomePage from './pages/HomePage';
import QueryPage from './pages/QueryPage';
import RightsPage from './pages/RightsPage';
import ComplaintPage from './pages/ComplaintPage';
import RTIPage from './pages/RTIPage';
import ScamAlertPage from './pages/ScamAlertPage';
import DictionaryPage from './pages/DictionaryPage';
import ProcedurePage from './pages/ProcedurePage';
import PoliceStationPage from './pages/PoliceStationPage';
import LawyerPage from './pages/LawyerPage';
import CaseLookupPage from './pages/CaseLookupPage';
import TimelinePage from './pages/TimelinePage';
import WitnessPage from './pages/WitnessPage';
import AvatarPage from './pages/AvatarPage';
import NavigatorPage from './pages/NavigatorPage';
import RightsModulePage from './pages/RightsModulePage';
import SimulatorPage from './pages/SimulatorPage';
import WomensosPage from './pages/WomensosPage';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111120',
            color: 'rgba(232,228,216,0.9)',
            border: '1px solid rgba(201,168,76,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="query" element={<QueryPage />} />
          <Route path="avatar" element={<AvatarPage />} />
          <Route path="rights" element={<RightsPage />} />
          <Route path="complaint" element={<ComplaintPage />} />
          <Route path="rti" element={<RTIPage />} />
          <Route path="scam" element={<ScamAlertPage />} />
          <Route path="dictionary" element={<DictionaryPage />} />
          <Route path="procedure" element={<ProcedurePage />} />
          <Route path="police" element={<PoliceStationPage />} />
          <Route path="lawyer" element={<LawyerPage />} />
          <Route path="case" element={<CaseLookupPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="witness" element={<WitnessPage />} />
          <Route path="navigator" element={<NavigatorPage />} />
          <Route path="rights-module" element={<RightsModulePage />} />
          <Route path="simulator" element={<SimulatorPage />} />
          <Route path="womensos" element={<WomensosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}