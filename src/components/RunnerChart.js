import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import {
  Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RunnerChart = () => {
  const [data, setData] = useState([]);
  const [upperLimit, setUpperLimit] = useState(1500);
  const [lowerLimit, setLowerLimit] = useState(1100);
  const [greenUpperLimit, setGreenUpperLimit] = useState(1400);
  const [greenLowerLimit, setGreenLowerLimit] = useState(1200);
  const [yellowUpperLimit, setYellowUpperLimit] = useState(1450);
  const [yellowLowerLimit, setYellowLowerLimit] = useState(1150);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: new Date(), time: '12:00', reading: '' });
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [processNo, setProcessNo] = useState('');
  const [processName, setProcessName] = useState('');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/runner/runnerData', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setData(response.data);
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
        reading: Number(newEntry.reading)
      };
      await axios.post('http://localhost:5500/api/runner/runnerData', newData);
      setOpenDialog(false);
      setNewEntry({ date: new Date(), time: '12:00', reading: '' });
      fetchData();
      toast.success('New entry added successfully!');
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to add new entry. Please try again.');
    }
  };

  const getColor = (value) => {
    if (value <= yellowLowerLimit || value >= yellowUpperLimit) return '#ff0000';
    if (value > yellowLowerLimit && value < greenLowerLimit) return '#ffff00';
    if (value > greenUpperLimit && value < yellowUpperLimit) return '#ffff00';
    return '#00ff00';
  };

  const CustomizedXAxisTick = ({ x, y, payload }) => {
    const date = new Date(payload.value);
    const dataPoint = data.find(d => d.date === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" transform="rotate(-35)">
          {`${date.getDate()}/${date.getMonth() + 1}`}
        </text>
        <text x={0} y={20} dy={16} textAnchor="middle" fill="#666" fontSize="10">
          {dataPoint?.time || ''}
        </text>
      </g>
    );
  };

  const chartContent = (
    <LineChart
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 65 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="date" 
        height={60} 
        tick={<CustomizedXAxisTick />}
      />
      <YAxis domain={[lowerLimit, upperLimit]} />
      <Tooltip 
        formatter={(value, name) => [value, 'Reading']}
        labelFormatter={(label) => {
          const date = new Date(label);
          const dataPoint = data.find(d => d.date === label);
          return `${date.toLocaleDateString()} ${dataPoint?.time || ''}`;
        }}
      />
      <Legend />
      <ReferenceArea y1={lowerLimit} y2={yellowLowerLimit} fill="red" fillOpacity={0.3} />
      <ReferenceArea y1={yellowLowerLimit} y2={greenLowerLimit} fill="yellow" fillOpacity={0.3} />
      <ReferenceArea y1={greenLowerLimit} y2={greenUpperLimit} fill="green" fillOpacity={0.3} />
      <ReferenceArea y1={greenUpperLimit} y2={yellowUpperLimit} fill="yellow" fillOpacity={0.3} />
      <ReferenceArea y1={yellowUpperLimit} y2={upperLimit} fill="red" fillOpacity={0.3} />
      <Line
        type="monotone"
        dataKey="reading"
        stroke="#8884d8"
        strokeWidth={3}
        name="Reading"
        dot={({ cx, cy, payload }) => (
          <circle cx={cx} cy={cy} r={6} fill={getColor(payload.reading)} stroke="#8884d8" strokeWidth={2} />
        )}
      />
    </LineChart>
  );

  const PrintLayout = ({ data, partInfo, limits }) => (
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

  const groupedData = data.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  return (
    <Card style={{ maxWidth: '1200px', margin: 'auto', marginTop: '20px', padding: '20px' }}>
      <CardContent>
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
          Characteristics: G.G. STRENGTH gm/cm² | Specification: {lowerLimit} TO {upperLimit} gm/cm²
        </Typography>

        <Box display="flex" justifyContent="space-between" marginBottom="1rem" flexWrap="wrap">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            customInput={<TextField label="Start Date" />}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            customInput={<TextField label="End Date" />}
          />
          <TextField
            label="Lower Limit"
            type="number"
            value={lowerLimit}
            onChange={(e) => setLowerLimit(Number(e.target.value))}
          />
          <TextField
            label="Upper Limit"
            type="number"
            value={upperLimit}
            onChange={(e) => setUpperLimit(Number(e.target.value))}
          />
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Entry
          </Button>
          <Button variant="contained" onClick={() => window.print()}>
            Print
          </Button>
        </Box>

        <Box style={{ height: '500px', width: '100%' }} id="chart-container">
          <ResponsiveContainer>
            {chartContent}
          </ResponsiveContainer>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Readings Table</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Reading</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedData).map(([date, entries]) => (
                  <React.Fragment key={date}>
                    <TableRow>
                      <TableCell colSpan={3} style={{ fontWeight: 'bold' }}>{date}</TableCell>
                    </TableRow>
                    {entries.map((entry, index) => (
                      <TableRow key={`${date}-${index}`}>
                        <TableCell></TableCell>
                        <TableCell>{entry.time}</TableCell>
                        <TableCell>{entry.reading}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <PrintLayout 
          data={data}
          partInfo={{
            partName,
            partNumber,
            processNo,
            processName
          }}
          limits={{
            upper: upperLimit,
            lower: lowerLimit,
            yellowUpper: yellowUpperLimit,
            yellowLower: yellowLowerLimit,
            greenUpper: greenUpperLimit,
            greenLower: greenLowerLimit
          }}
        />

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

// import React, { useState, useEffect } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import {
//   Card, CardContent, Typography, Button, TextField, Table,
//   TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Dialog, DialogActions, DialogContent, DialogTitle
// } from '@mui/material';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import axios from 'axios';

// const RunnerChart = () => {
//   const [data, setData] = useState([]);
//   const [upperLimit, setUpperLimit] = useState(1500);
//   const [lowerLimit, setLowerLimit] = useState(1100);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newEntry, setNewEntry] = useState({ date: new Date(), time: '09:00', reading: '' });
//   const [startDate, setStartDate] = useState(() => {
//     const date = new Date();
//     date.setDate(date.getDate() - 1);
//     return date;
//   });
//   const [endDate, setEndDate] = useState(() => {
//     const date = new Date();
//     date.setDate(date.getDate() + 3);
//     return date;
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:5500/api/runner/runnerData', {
//           params: {
//             startDate: startDate.toISOString(),
//             endDate: endDate.toISOString(),
//           }
//         });
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [startDate, endDate]);

//   const handleAddEntry = async () => {
//     try {
//       const formattedDate = newEntry.date.toISOString().split('T')[0];
//       const newData = {
//         date: formattedDate,
//         time: newEntry.time,
//         reading: Number(newEntry.reading)
//       };

//       await axios.post('http://localhost:5500/api/runner/runnerData', newData);

//       setData(prevData => [...prevData, newData]);
//       setOpenDialog(false);
//       setNewEntry({ date: new Date(), time: '09:00', reading: '' });
//     } catch (error) {
//       console.error('Error adding entry:', error);
//     }
//   };

//   const formatXAxis = (tickItem) => {
//     const date = new Date(tickItem);
//     return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
//   };

//   const getColor = (value) => {
//     if (value <= 1200 || value >= 1400) return '#ff0000';
//     if (value > 1200 && value < 1300) return '#ffff00';
//     return '#00ff00';
//   };

//   const printChart = () => {
//     window.print();
//   };

//   return (
//     <div>
//       <Card style={{ maxWidth: '1200px', margin: 'auto', marginTop: '20px' }}>
//         <CardContent>
//           <Typography variant="h4" gutterBottom>
//             AKP FOUNDRIES - RUN CHART
//           </Typography>
//           <Typography variant="subtitle1" gutterBottom>
//             Characteristics: G.G. STRENGTH gm/cm² | Specification: {lowerLimit} TO {upperLimit} gm/cm²
//           </Typography>

//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap' }}>
//             <TextField
//               label="Lower Limit"
//               type="number"
//               value={lowerLimit}
//               onChange={(e) => setLowerLimit(Number(e.target.value))}
//               style={{ marginRight: '1rem' }}
//             />
            
//             <TextField
//               label="Upper Limit"
//               type="number"
//               value={upperLimit}
//               onChange={(e) => setUpperLimit(Number(e.target.value))}
//               style={{ marginRight: '1rem' }}
//             />

//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date)}
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//             />

//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date)}
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               minDate={startDate}
//             />

//             <Button variant="contained" onClick={() => setOpenDialog(true)} style={{ marginRight: '1rem' }}>
//               Add Entry
//             </Button>
//             <Button variant="contained" onClick={printChart}>
//               Print Chart
//             </Button>
//           </div>

//           <div id="chart-container">
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tickFormatter={formatXAxis} />
//                 <YAxis domain={[lowerLimit, upperLimit]} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="reading"
//                   stroke="#8884d8"
//                   name="Reading"
//                   dot={({ cx, cy, payload }) => (
//                     <circle cx={cx} cy={cy} r={4} fill={getColor(payload.reading)} />
//                   )}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>

//         {/* Add Entry Dialog */}
//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//           <DialogTitle>Add New Entry</DialogTitle>
//           <DialogContent>
//             <DatePicker
//               selected={newEntry.date}
//               onChange={(date) => setNewEntry(prev => ({ ...prev, date }))}
//               dateFormat="yyyy-MM-dd"
//               customInput={<TextField label="Date" fullWidth />}
//             />
//             <TextField
//               label="Time"
//               type="time"
//               value={newEntry.time}
//               onChange={(e) => setNewEntry(prev => ({ ...prev, time: e.target.value }))}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Reading"
//               type="number"
//               value={newEntry.reading}
//               onChange={(e) => setNewEntry(prev => ({ ...prev, reading: e.target.value }))}
//               fullWidth
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleAddEntry} color="primary">
//               Add
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Card>

//       {/* Custom Print CSS */}
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             #chart-container, #chart-container * {
//               visibility: visible;
//             }
//             #chart-container {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100vw;
//               height: 100vh;
//               overflow: hidden;
//             }
//             .MuiButton-root {
//               display: none !important;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default RunnerChart;