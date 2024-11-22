import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RunnerChart from './components/SandTesting/CGS';
import ReadingsTable from './components/SandTesting/ReadingsTable';
import ImportTable from './components/SandTesting/importModal';
import Dashboard from './components/Dashboard';
import SandTesting from './components/SandTesting/SandTesting';
import MoldingAndCoreMakingParameters from './components/Molding and Core Making/MoldMaking';
import MetalPouringParameters from './components/Metal Pouring/MetalPouring';
import FurnaceOperationParameters from './components/Furnance Operation/FurnanceOperation';
import CoolingAndSolidificationParameters from './components/Cooling & Solidification/Cooling';
import ChemicalCompositionParameters from './components/Chemical Composition/ChemicalComposition';
import CastingDefectAnalysis from './components/Casting Defect/CastingDefect';
import InventoryAndRawMaterialParameters from './components/Inventory and Raw Material/Inventory';
import QualityControlParameters from './components/Quality Control/QualityControl';
import ProductionAndEfficiencyParameters from './components/Production and Efficiency/Production';
import EnvironmentalAndSafetyParameters from './components/Environmental and Safety/Environment';
import Login from './components/User Management/Login';
import Register from './components/User Management/Register';
import Permeability from './components/SandTesting/permeability';
import FoundryAverages from './components/SandTesting/FoundryAverage';
import FoundryReadings from './components/SandTesting/FoundryReading';
import SandDashboard from './components/SandTesting/Dashboard';
import Moisture from './components/SandTesting/moisture';
import Compactability from './components/SandTesting/compactablity'
import SpcDashboard from './components/SandTesting/spcDashboard'
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/foundry-reading" element={<FoundryReadings />} />
      <Route path="/foundry-average" element={<FoundryAverages />} />
      <Route path="/sand-dashboard" element={<SandDashboard />} />
        <Route path="/runner" element={<RunnerChart />} />
        <Route path="/reading" element={<ReadingsTable />} />
        <Route path="/moisture" element={<Moisture />} />
        <Route path="/compactability" element={<Compactability />} />
        <Route path="/import" element={<ImportTable />} />
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path='/' element={<Login/>}/>
        {/* <Route path='/register' element={<Register/>}/> */}
        <Route path="/sand-testing" element={<SandTesting />} />
        <Route path="/permeability" element={<Permeability/>} />
        <Route path="/spcdas" element={<SpcDashboard/>} />
        {/* <Route path="/mold-testing" element={<MoldingAndCoreMakingParameters />} />
        <Route path="/metal-pouring" element={<MetalPouringParameters />} />
        <Route path="/furnace-operation" element={<FurnaceOperationParameters />} />
        <Route path="/cooling-solidification" element={<CoolingAndSolidificationParameters />} />
        <Route path="/chemical-composition" element={<ChemicalCompositionParameters />} />
        <Route path="/casting-defect-analysis" element={<CastingDefectAnalysis />} />
        <Route path="/inventory-raw-material" element={<InventoryAndRawMaterialParameters />} />
        <Route path="/quality-control" element={<QualityControlParameters />} />
        <Route path="/production-efficiency" element={<ProductionAndEfficiencyParameters />} />
        <Route path="/environmental-safety" element={<EnvironmentalAndSafetyParameters />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
