// import React, { useState, useEffect } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
// } from 'recharts';
// import {
//   Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
//   Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
// } from '@mui/material';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { format } from 'date-fns';

// const RunnerChart = () => {
//   const [data, setData] = useState([]);
//   // Updated limits for compactability
//   const upperLimit = 47.5;  // Maximum compactability limit
//   const lowerLimit = 37;  // Minimum compactability limit
//   const greenUpperLimit = 44;  // Upper green (control) limit
//   const greenLowerLimit = 40;  // Lower green (control) limit
//   const yellowUpperLimit = 46;  // Upper yellow (warning) limit
//   const yellowLowerLimit = 38;  // Lower yellow (warning) limit

//   const [openDialog, setOpenDialog] = useState(false);
//   const [newEntry, setNewEntry] = useState({ date: new Date(), time: '12:00', reading: '' });
//   const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
//   const [endDate, setEndDate] = useState(new Date());
//   const [partName, setPartName] = useState('');
//   const [partNumber, setPartNumber] = useState('');
//   const [processNo, setProcessNo] = useState('');
//   const [processName, setProcessName] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, [startDate, endDate]);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('http://localhost:5500/api/runner/runnerData', {
//         params: {
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString(),
//           type: "compactability"
//         }
//       });
//       setData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data. Please try again.');
//     }
//   };

//   const handleAddEntry = async () => {
//     try {
//       const newData = {
//         date: newEntry.date,
//         time: newEntry.time,
//         type: "compactability",
//         reading: Number(newEntry.reading)
//       };
//       await axios.post('http://localhost:5500/api/runner/runnerData', newData);
//       setOpenDialog(false);
//       setNewEntry({ date: new Date(), time: '12:00', reading: '' });
//       fetchData();
//       toast.success('New entry added successfully!');
//     } catch (error) {
//       console.error('Error adding entry:', error);
//       toast.error('Failed to add new entry. Please try again.');
//     }
//   };

//   const getColor = (value) => {
//     if (value <= yellowLowerLimit || value >= yellowUpperLimit) return '#ff0000';  // Red zone
//     if ((value > yellowLowerLimit && value < greenLowerLimit) || 
//         (value > greenUpperLimit && value < yellowUpperLimit)) return '#ffff00';  // Yellow zone
//     return '#00ff00';  // Green zone
//   };

//   const CustomizedXAxisTick = ({ x, y, payload }) => {
//     const dataPoint = data.find(d => d.date === payload.value);
//     if (!dataPoint) return null;

//     const date = new Date(dataPoint.date);
//     const formattedDate = format(date, 'dd/MM');
//     const time = dataPoint.time;

//     return (
//       <g transform={`translate(${x},${y})`}>
//         <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">
//           {`${formattedDate} ${time}`}
//         </text>
//       </g>
//     );
//   };

//   // Generate ticks with intervals of 1
//   const generateTicks = () => {
//     const ticks = [];
//     for (let i = lowerLimit; i <= upperLimit; i++) {
//       ticks.push(i);
//     }
//     return ticks;
//   };

//   const chartContent = (
//     <LineChart
//       data={data}
//       margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
//     >
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis 
//         dataKey="date" 
//         height={90} 
//         tick={<CustomizedXAxisTick />}
//         interval={0}
//       />
//       <YAxis 
//         domain={[lowerLimit, upperLimit]}
//         ticks={generateTicks()}
//         tickFormatter={(value) => value}
//       />
//       <Tooltip 
//         formatter={(value, name) => [value, 'Reading']}
//         labelFormatter={(label) => {
//           const dataPoint = data.find(d => d.date === label);
//           if (!dataPoint) return '';
//           const date = new Date(dataPoint.date);
//           return `${format(date, 'dd/MM/yyyy')} ${dataPoint.time}`;
//         }}
//       />
//       <Legend />
//       <ReferenceArea y1={lowerLimit} y2={yellowLowerLimit} fill="red" fillOpacity={0.3} />
//       <ReferenceArea y1={yellowLowerLimit} y2={greenLowerLimit} fill="yellow" fillOpacity={0.3} />
//       <ReferenceArea y1={greenLowerLimit} y2={greenUpperLimit} fill="green" fillOpacity={0.3} />
//       <ReferenceArea y1={greenUpperLimit} y2={yellowUpperLimit} fill="yellow" fillOpacity={0.3} />
//       <ReferenceArea y1={yellowUpperLimit} y2={upperLimit} fill="red" fillOpacity={0.3} />
//       <Line
//         type="monotone"
//         dataKey="reading"
//         stroke="#8884d8"
//         strokeWidth={3}
//         name="Reading"
//         dot={({ cx, cy, payload }) => (
//           <circle 
//             cx={cx} 
//             cy={cy} 
//             r={6} 
//             fill={getColor(payload.reading)} 
//             stroke="#8884d8" 
//             strokeWidth={2} 
//           />
//         )}
//       />
//     </LineChart>
//   );

//   const PrintLayout = ({ data, partInfo, limits }) => (
//     <div className="print-only">
//       <div className="print-header">
//         <h1>AKP FOUNDRIES - RUN CHART</h1>
//         <div className="print-info-grid">
//           <div>
//             <label>Part Name:</label>
//             <span>{partInfo.partName}</span>
//           </div>
//           <div>
//             <label>Part Number:</label>
//             <span>{partInfo.partNumber}</span>
//           </div>
//           <div>
//             <label>Process No:</label>
//             <span>{partInfo.processNo}</span>
//           </div>
//           <div>
//             <label>Process Name:</label>
//             <span>{partInfo.processName}</span>
//           </div>
//         </div>
//         <div className="print-limits">
//           <p>Characteristics: COMPACTABILITY | Specification: {limits.lower} TO {limits.upper}</p>
//           <div className="print-date-range">
//             <span>From: {startDate.toLocaleDateString()}</span>
//             <span>To: {endDate.toLocaleDateString()}</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="print-chart">
//         {React.cloneElement(chartContent, {
//           width: 800,
//           height: 400
//         })}
//       </div>

//       <div className="print-legend">
//         <div className="legend-item">
//           <span className="legend-color green"></span>
//           <span>Control Limit ({greenLowerLimit} - {greenUpperLimit})</span>
//         </div>
//         <div className="legend-item">
//           <span className="legend-color yellow"></span>
//           <span>Warning Limit ({yellowLowerLimit} - {greenLowerLimit}, {greenUpperLimit} - {yellowUpperLimit})</span>
//         </div>
//         <div className="legend-item">
//           <span className="legend-color red"></span>
//           <span>Stop and Correct (Below {yellowLowerLimit}, Above {yellowUpperLimit})</span>
//         </div>
//       </div>

//       <div className="print-signatures">
//         <div>
//           <p>Operator Sign: _________________</p>
//         </div>
//         <div>
//           <p>H.O.D Sign: _________________</p>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <Card style={{ maxWidth: '1200px', margin: 'auto', marginTop: '20px', padding: '20px' }}>
//       <CardContent>
//         <Typography variant="h4" gutterBottom align="center">
//           AKP FOUNDRIES - RUN CHART
//         </Typography>
        
//         <Grid container spacing={2} style={{ marginBottom: '20px' }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Part Name"
//               value={partName}
//               onChange={(e) => setPartName(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Part Number"
//               value={partNumber}
//               onChange={(e) => setPartNumber(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Process No."
//               value={processNo}
//               onChange={(e) => setProcessNo(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               label="Process Name"
//               value={processName}
//               onChange={(e) => setProcessName(e.target.value)}
//             />
//           </Grid>
//         </Grid>

//         <Typography variant="subtitle1" gutterBottom>
//           Characteristics: COMPACTABILITY | Specification: {lowerLimit} TO {upperLimit}
//         </Typography>

//         <Box display="flex" justifyContent="space-between" marginBottom="1rem" flexWrap="wrap">
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             selectsStart
//             startDate={startDate}
//             endDate={endDate}
//             customInput={<TextField label="Start Date" />}
//           />
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             selectsEnd
//             startDate={startDate}
//             endDate={endDate}
//             minDate={startDate}
//             customInput={<TextField label="End Date" />}
//           />
//           <TextField
//             label="Lower Limit"
//             type="number"
//             value={lowerLimit}
//             disabled
//           />
//           <TextField
//             label="Upper Limit"
//             type="number"
//             value={upperLimit}
//             disabled
//           />
//           <Button variant="contained" onClick={() => setOpenDialog(true)}>
//             Add Entry
//           </Button>
//           <Button variant="contained" onClick={() => window.print()}>
//             Print
//           </Button>
//         </Box>

//         <Box style={{ height: '500px', width: '100%' }}>
//           <ResponsiveContainer>
//             {chartContent}
//           </ResponsiveContainer>
//         </Box>

//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom>Readings Table</Typography>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Time</TableCell>
//                   <TableCell>Reading</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {Object.entries(data.reduce((acc, entry) => {
//                   const date = new Date(entry.date).toLocaleDateString();
//                   if (!acc[date]) {
//                     acc[date] = [];
//                   }
//                   acc[date].push(entry);
//                   return acc;
//                 }, {})).map(([date, entries]) => (
//                   <React.Fragment key={date}>
//                     <TableRow>
//                       <TableCell colSpan={3} style={{ fontWeight: 'bold' }}>{date}</TableCell>
//                     </TableRow>
//                     {entries.map((entry, index) => (
//                       <TableRow key={`${date}-${index}`}>
//                         <TableCell></TableCell>
//                         <TableCell>{entry.time}</TableCell>
//                         <TableCell>{entry.reading}</TableCell>
//                       </TableRow>
//                     ))}
//                   </React.Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>

//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//           <DialogTitle>Add New Entry</DialogTitle>
//           <DialogContent>
//             <DatePicker
//               selected={newEntry.date}
//               onChange={(date) => setNewEntry(prev => ({ ...prev, date }))}
//               customInput={<TextField label="Date" fullWidth margin="normal" />}
//             />
//             <TextField
//               label="Time"
//               type="time"
//               value={newEntry.time}
//               onChange={(e) => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
//               fullWidth
//               margin="normal"
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               inputProps={{
//                 step: 300, // 5 min
//               }}
//             />
//             <TextField
//               label="Reading"
//               type="number"
//               value={newEntry.reading}
//               onChange={(e) => setNewEntry(prev => ({ ...prev, reading: e.target.value }))}
//               fullWidth
//               margin="normal"
//               inputProps={{
//                 step: "1"
//               }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button onClick={handleAddEntry} color="primary">Add</Button>
//           </DialogActions>
//         </Dialog>

//         <ToastContainer position="bottom-right" />

//       <style>{`
//   @media screen {
//     .print-only {
//       display: none;
//     }
//   }
  
//   @media print {
//     body * {
//       visibility: hidden;
//     }
//     .print-only, .print-only * {
//       visibility: visible;
//     }
//     .print-only {
//       position: absolute;
//       left: 0;
//       top: 0;
//       width: 100%;
//     }
//     @page {
//       size: landscape;
//       margin: 0.5cm;
//     }
    
//     .print-header {
//       margin-bottom: 20px;
//     }
    
//     .print-header h1 {
//       text-align: center;
//       margin-bottom: 15px;
//     }
    
//     .print-info-grid {
//       display: grid;
//       grid-template-columns: repeat(4, 1fr);
//       gap: 10px;
//       margin-bottom: 15px;
//     }
    
//     .print-info-grid div {
//       display: flex;
//       flex-direction: column;
//     }
    
//     .print-info-grid label {
//       font-weight: bold;
//       margin-bottom: 5px;
//     }
    
//     .print-limits {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 20px;
//     }
    
//     .print-chart {
//       height: 400px;
//       margin-bottom: 20px;
//     }
    
//     .print-legend {
//       display: flex;
//       justify-content: center;
//       gap: 20px;
//       margin-bottom: 20px;
//     }
    
//     .legend-item {
//       display: flex;
//       align-items: center;
//       gap: 5px;
//     }
    
//     .legend-color {
//       width: 20px;
//       height: 20px;
//       display: inline-block;
//     }
    
//     .legend-color.green { background-color: #006400; }
//     .legend-color.yellow { background-color: #b8860b; }
//     .legend-color.red { background-color: #8b0000; }
    
//     .print-signatures {
//       display: flex;
//       justify-content: space-between;
//       margin-top: 40px;
//     }
//   }
// `}</style>
// </CardContent>
//     </Card>
 
//   );
// };

// export default RunnerChart;

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import {
  Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Grid, FormControlLabel, Checkbox
} from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import StatisticalParametersChart from './StasticalChart';

const RunnerChart = () => {
  const [data, setData] = useState([]);
  const [showCpCpk, setShowCpCpk] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: new Date(), time: '12:00', reading: '', remark: '' });
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [processNo, setProcessNo] = useState('');
  const [processName, setProcessName] = useState('');
  const [limits, setLimits] = useState({
    upper: 1500,
    lower: 1100,
    greenUpper: 1400,
    greenLower: 1200,
    yellowUpper: 1450,
    yellowLower: 1150
  });

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/runner/runnerData', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          type: "cgs"
        }
      });

      if (response.data.success) {
        // Process the nested readings data
        const processedData = response.data.data.reduce((acc, day) => {
          const dayReadings = day.readings.map(reading => ({
            date: day.date,
            reading: reading.reading,
            time: reading.time,
            remark: reading.remark, // Add this line
            formattedDate: format(new Date(day.date), 'MM/dd') + ' ' + reading.time,
            cp: day.cp || 0,
            cpk: day.cpk || 0
          }));
          return [...acc, ...dayReadings];
        }, []);

        // Update limits if they exist in the response
        if (response.data.data[0]) {
          setLimits(prev => ({
            ...prev,
            upper: response.data.data[0].upperLimit,
            lower: response.data.data[0].lowerLimit
          }));
        }

        setData(processedData);
      } else {
        toast.error('Failed to fetch data: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
    }
  };

  const handleAddEntry = async () => {
    try {
      const newData = {
        date: newEntry.date,
        time: newEntry.time,
        type: "cgs",
        reading: Number(newEntry.reading),
        remark: newEntry.remark
      };
      await axios.post('http://localhost:5500/api/runner/runnerData', newData);
      setOpenDialog(false);
      setNewEntry({ date: new Date(), time: '12:00', reading: '', remark: '' });
      fetchData();
      toast.success('New entry added successfully!');
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to add new entry. Please try again.');
    }
  };
  const getColor = (value) => {
    if (value <= limits.yellowLower || value >= limits.yellowUpper) return '#FF0000'; // Bright Red
    if (value > limits.yellowLower && value < limits.greenLower) return '#FFD700'; // Bright Golden Yellow
    if (value > limits.greenUpper && value < limits.yellowUpper) return '#FFD700'; // Bright Golden Yellow
    return '#00FF00'; // Bright Green
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc'
        }}>
          <p>{`Date: ${data.formattedDate}`}</p>
          <p>{`Reading: ${data.reading}`}</p>
          {data.remark && <p>{`Remark: ${data.remark}`}</p>}
          {showCpCpk && (
            <>
              <p>{`Cp: ${data.cp?.toFixed(2) || 'N/A'}`}</p>
              <p>{`Cpk: ${data.cpk?.toFixed(2) || 'N/A'}`}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const PrintLayout = ({ data, partInfo, limits, showCpCpk }) => (
    <div className="print-only">
      <div className="print-header">
        <h1>AKP FOUNDRIES - RUN CHART</h1>
        <div className="print-info-grid">
          <div>
            <label>Part Name:</label>
            <span>{partInfo.partName}</span>
          </div>
          <div>
            <label>Part Number:</label>
            <span>{partInfo.partNumber}</span>
          </div>
          <div>
            <label>Process No:</label>
            <span>{partInfo.processNo}</span>
          </div>
          <div>
            <label>Process Name:</label>
            <span>{partInfo.processName}</span>
          </div>
        </div>
        <div className="print-limits">
          <p>Characteristics: G.G. STRENGTH gm/cm² | Specification: {limits.lower} TO {limits.upper} gm/cm²</p>
          <div className="print-date-range">
            <span>From: {startDate.toLocaleDateString()}</span>
            <span>To: {endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="print-chart">
        {React.cloneElement(chartContent, {
          width: 800,
          height: 400
        })}
      </div>

      {showCpCpk && (
        <div className="print-statistical-chart">
          <StatisticalParametersChart data={data} />
        </div>
      )}
  
      <div className="print-legend">
        <div className="legend-item">
          <span className="legend-color green"></span>
          <span>Control Limit</span>
        </div>
        <div className="legend-item">
          <span className="legend-color yellow"></span>
          <span>Warning Limit</span>
        </div>
        <div className="legend-item">
          <span className="legend-color red"></span>
          <span>Stop and Correct</span>
        </div>
      </div>
  
      <div className="print-signatures">
        <div>
          <p>Operator Sign: _________________</p>
        </div>
        <div>
          <p>H.O.D Sign: _________________</p>
        </div>
      </div>
    </div>
  );

  const chartContent = (
    <LineChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="formattedDate"
        height={60}
        angle={0}
        interval={0}
        fontSize={10}
      />
      <YAxis domain={[limits.lower, limits.upper]} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <ReferenceArea y1={limits.lower} y2={limits.yellowLower} fill="red" fillOpacity={0.8} />
      <ReferenceArea y1={limits.yellowLower} y2={limits.greenLower} fill="yellow" fillOpacity={0.5} />
      <ReferenceArea y1={limits.greenLower} y2={limits.greenUpper} fill="green" fillOpacity={0.5} />
      <ReferenceArea y1={limits.greenUpper} y2={limits.yellowUpper} fill="yellow" fillOpacity={0.5} />
      <ReferenceArea y1={limits.yellowUpper} y2={limits.upper} fill="red" fillOpacity={0.8} />
      <Line
        type="monotone"
        dataKey="reading"
        stroke="#8884d8"
        strokeWidth={3}
        name="Reading"
        dot={({ cx, cy, payload }) => (
          <circle 
            cx={cx} 
            cy={cy} 
            r={6} 
            fill={getColor(payload.reading)} 
            stroke="#8884d8" 
            strokeWidth={2} 
          />
        )}
      />
    </LineChart>
  );

  return (
    <Card style={{ maxWidth: '1200px', margin: 'auto', marginTop: '20px', padding: '20px' }}>
      <CardContent>
        {/* Rest of your JSX remains the same... */}
        <Typography variant="h4" gutterBottom align="center">
          AKP FOUNDRIES - RUN CHART
        </Typography>
        
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Part Name"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Part Number"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Process No."
              value={processNo}
              onChange={(e) => setProcessNo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Process Name"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom>
          Characteristics: G.G. STRENGTH gm/cm² | Specification: {limits.lower} TO {limits.upper} gm/cm²
        </Typography>

        <Box display="flex" justifyContent="space-between" marginBottom="1rem" alignItems="center" flexWrap="wrap">
          <Box display="flex" gap={2} alignItems="center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              customInput={<TextField label="Start Date" size="small" />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              customInput={<TextField label="End Date" size="small" />}
            />
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCpCpk}
                  onChange={(e) => setShowCpCpk(e.target.checked)}
                />
              }
              label="Show Cp/Cpk"
            />

<PrintLayout 
  data={data}
  partInfo={{
    partName,
    partNumber,
    processNo,
    processName
  }}
  limits={{
    upper: limits.upper,
    lower: limits.lower,
    yellowUpper: limits.yellowUpper,
    yellowLower: limits.yellowLower,
    greenUpper: limits.greenUpper,
    greenLower: limits.greenLower
  }}
/>        
            <Button variant="contained" onClick={() => setOpenDialog(true)}>
              Add Entry
            </Button>
            <Button variant="contained" onClick={() => window.print()}>
  Print
</Button>
          </Box>
        </Box>

        <Box style={{ height: '500px', width: '100%' }}>
          <ResponsiveContainer>
            {chartContent}
          </ResponsiveContainer>
        </Box>

        {showCpCpk && (
  <StatisticalParametersChart data={data} />
)}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogContent>
            <DatePicker
              selected={newEntry.date}
              onChange={(date) => setNewEntry(prev => ({ ...prev, date }))}
              customInput={<TextField label="Date" fullWidth margin="normal" />}
            />
            <TextField
              label="Time"
              type="time"
              value={newEntry.time}
              onChange={(e) => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
            <TextField
              label="Reading"
              type="number"
              value={newEntry.reading}
              onChange={(e) => setNewEntry(prev => ({ ...prev, reading: e.target.value }))}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Remark"
              value={newEntry.remark}
              onChange={(e) => setNewEntry(prev => ({ ...prev, remark: e.target.value }))}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEntry} color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="bottom-right" />

      <style>{`
  @media screen {
    .print-only {
      display: none;
    }
  }
  
  @media print {
    body * {
      visibility: hidden;
    }
    .print-only, .print-only * {
      visibility: visible;
    }
    .print-only {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    @page {
      size: landscape;
      margin: 0.5cm;
    }
    
    .print-header {
      margin-bottom: 20px;
    }
    
    .print-header h1 {
      text-align: center;
      margin-bottom: 15px;
    }
    
    .print-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .print-info-grid div {
      display: flex;
      flex-direction: column;
    }
    
    .print-info-grid label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .print-limits {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    
    .print-chart {
      height: 400px;
      margin-bottom: 20px;
    }
    
    .print-legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .legend-color {
      width: 20px;
      height: 20px;
      display: inline-block;
    }
    
    .legend-color.green { background-color: #006400; }
    .legend-color.yellow { background-color: #b8860b; }
    .legend-color.red { background-color: #8b0000; }
    
    .print-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }
  }
`}</style>
</CardContent>
    </Card>
 
  );
};

export default RunnerChart;