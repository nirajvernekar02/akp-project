import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FoundryReadings from './components/SandTesting/FoundryReading';
import FoundryAverages from './components/SandTesting/FoundryAverage';
import SandDashboard from './components/SandTesting/Dashboard';
import Moisture from './components/SandTesting/moisture';
import Compactability from './components/SandTesting/compactablity';
import ComparisonChart from './components/SandTesting/ComparsionChart';
import ImportTable from './components/SandTesting/importModal';
import RunnerChart from './components/SandTesting/CGS';
import ReadingsTable from './components/SandTesting/ReadingsTable';
import SpcDashboard from './components/SandTesting/spcDashboard';
import Permeability from './components/SandTesting/permeability';
import Login from './components/User Management/Login';
import ProtectedRoute from '../src/redux/ProtectedRoute';
import SandTesting from './components/SandTesting/SandTesting';
import DeveloperPage from './components/User Management/DeveloperPage';
import FishboneDiagramExample from './components/fishbone';
import RunnerData from './components/SandTesting/RunnerData';
function App() {
  return (

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/fish" element={<FishboneDiagramExample />} />

        {/* Protected Routes */}
        <Route
          path="/foundry-reading"
          element={
            <ProtectedRoute>
              <FoundryReadings />
            </ProtectedRoute>
          }
        />

<Route
          path="/view-readings"
          element={
            <ProtectedRoute>
              <RunnerData />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foundry-average"
          element={
            <ProtectedRoute>
              <FoundryAverages />
            </ProtectedRoute>
          }
        />
         <Route
          path="/developer"
          element={
           
              <DeveloperPage />
           
          }
        />
           <Route
          path="/sand-testing"
          element={
            <ProtectedRoute>
              <SandTesting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sand-dashboard"
          element={
            <ProtectedRoute>
              <SandDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moisture"
          element={
            <ProtectedRoute>
              <Moisture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compactability"
          element={
            <ProtectedRoute>
              <Compactability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comparison"
          element={
            <ProtectedRoute>
              <ComparisonChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/import"
          element={
            <ProtectedRoute>
              <ImportTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runner"
          element={
            <ProtectedRoute>
              <RunnerChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reading"
          element={
            <ProtectedRoute>
              <ReadingsTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permeability"
          element={
            <ProtectedRoute>
              <Permeability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spcdas"
          element={
            <ProtectedRoute>
              <SpcDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

  );
}

export default App;
