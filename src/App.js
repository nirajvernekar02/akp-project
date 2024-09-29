import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RunnerChart from './components/RunnerChart';
import ReadingsTable from './components/ReadingsTable';

function App() {
  return (
    <Router>
      <Routes>
   
        <Route path="/" element={<RunnerChart />} />
        <Route path="/reading" element={<ReadingsTable />} />
      
      </Routes>
    </Router>
  );
}

export default App;
