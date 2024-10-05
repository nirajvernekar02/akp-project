import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RunnerChart from './components/RunnerChart';
import ReadingsTable from './components/ReadingsTable';
import ImportTable from './components/importModal';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
   
        <Route path="/" element={<RunnerChart />} />
        <Route path="/reading" element={<ReadingsTable />} />
        <Route path='/import' element={<ImportTable/>}/>
          <Route path='/Dashboard'element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
