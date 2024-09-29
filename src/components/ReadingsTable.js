import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Paper, Button, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Typography, IconButton, Tooltip, Box, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, GetApp as ExportIcon
} from '@mui/icons-material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import AddEditEntryModal from './AddEntryModal';

const ReadingsTable = () => {
  const [readingsData, setReadingsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchReadings = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/reading/all');
      setReadingsData(response.data.data);
    } catch (error) {
      toast.error('Error fetching readings');
    }
  }, []);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const handleDelete = async (readingId, index) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const updatedReadingsData = readingsData.map((reading) => {
          if (reading._id === readingId) {
            const updatedReadings = [...reading.readings];
            updatedReadings.splice(index, 1);
            return { ...reading, readings: updatedReadings };
          }
          return reading;
        });
        setReadingsData(updatedReadingsData);
        
        await axios.patch(`http://localhost:5500/api/reading/update/${readingId}`, {
          readings: updatedReadingsData.find((reading) => reading._id === readingId).readings,
        });

        toast.success('Reading deleted successfully');
        fetchReadings();
      } catch (error) {
        toast.error('Error deleting reading');
      }
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(readingsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Readings');
    XLSX.writeFile(workbook, 'Readings.xlsx');
  };

  // Function to calculate statistics
  const calculateStatistics = (readings) => {
    if (!readings.length) return {};

    const n = readings.length;
    const mean = readings.reduce((sum, val) => sum + val, 0) / n;
    const variance =
      readings.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const sd = Math.sqrt(variance);

    const cp = (Math.max(...readings) - Math.min(...readings)) / (6 * sd);
    const cpk1 = (mean - Math.min(...readings)) / (3 * sd);
    const cpk2 = (Math.max(...readings) - mean) / (3 * sd);
    const cpk = Math.min(cpk1, cpk2);
    const threeSigma = 3 * sd;
    const sixSigma = 6 * sd;

    return { mean, sd, cp, cpk, cpk1, cpk2, threeSigma, sixSigma };
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Mold Hardness Readings
        </Typography>
        <div>
          <Tooltip title="Add New Entry">
            <IconButton
              color="primary"
              onClick={() => {
                setEditData(null);
                setModalOpen(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton color="secondary" onClick={handleExportToExcel}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Box>

      {readingsData.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No readings available. Add a new reading to get started.
        </Typography>
      ) : (
        readingsData.map((reading) => {
          const stats = calculateStatistics(reading.readings);

          return (
            <Paper key={reading._id} elevation={3} className="p-6 mb-8">
              <Typography variant="h6" component="h2" gutterBottom className="text-center">
                Date: {reading.date}
              </Typography>

              <Divider className="mb-4" />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reading No.</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reading.readings.map((value, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{value}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditData({ ...reading, currentReadingIndex: index, currentValue: value });
                                setModalOpen(true);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(reading._id, index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Statistics Table */}
              <Box className="mt-6">
                <Typography variant="h6" component="h3" gutterBottom>
                  Statistics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Average</TableCell>
                        <TableCell>Standard Deviation (SD)</TableCell>
                        <TableCell>Cp</TableCell>
                        <TableCell>Cpk</TableCell>
                        <TableCell>Cpk1</TableCell>
                        <TableCell>Cpk2</TableCell>
                        <TableCell>3-Sigma</TableCell>
                        <TableCell>6-Sigma</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell>{stats.mean.toFixed(2)}</TableCell>
                        <TableCell>{stats.sd.toFixed(2)}</TableCell>
                        <TableCell>{stats.cp.toFixed(2)}</TableCell>
                        <TableCell>{stats.cpk.toFixed(2)}</TableCell>
                        <TableCell>{stats.cpk1.toFixed(2)}</TableCell>
                        <TableCell>{stats.cpk2.toFixed(2)}</TableCell>
                        <TableCell>{stats.threeSigma.toFixed(2)}</TableCell>
                        <TableCell>{stats.sixSigma.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          );
        })
      )}

      <AddEditEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchReadings}
        editData={editData}
      />
    </Container>
  );
};

export default ReadingsTable;
