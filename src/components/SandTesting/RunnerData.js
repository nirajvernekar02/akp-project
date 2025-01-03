import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Box,
  InputLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "./BackButton";

const RunnerData = () => {
  const [data, setData] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
        setLoading(true);
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("http://localhost:5500/api/runner/runner", {
        params,
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id: id, readings } = selectedReading;
      const readingId = readings[0]._id;

      await axios.put(
        `http://localhost:5500/api/runner/runnerData/${id}/readings/${readingId}`,
        { ...readings[0], type }
      );
      toast.success("Reading updated successfully");
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating reading:", error);
      toast.error("Failed to update reading");
    }
  };

  const handleDelete = async (id, readingId) => {
    try {
      await axios.delete(
        `http://localhost:5500/api/runner/runnerData/${id}/readings/${readingId}`
      );
      toast.success("Reading deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting reading:", error);
      toast.error("Failed to delete reading");
    }
  };

  const handleExport = () => {
    const exportData = selectedRows.length
      ? selectedRows.map((rowId) => data.find((row) => row.id === rowId))
      : data;

    if (!exportData.length) {
      toast.error("No data available to export.");
      return;
    }

    const formattedData = exportData.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Runner Data");

    XLSX.writeFile(workbook, "RunnerData.xlsx");
    toast.success("Data exported successfully!");
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  useEffect(() => {
    fetchData();
  }, [typeFilter, startDate, endDate]);

  return (
    <div className="container mx-auto p-6">
        <BackButton/>
      <h1 className="text-3xl font-semibold mb-6 text-center">Runner Data</h1>

      <Box className="mb-15 flex flex-wrap justify-between items-center gap-6">
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white"
        >
          Export to Excel
        </Button>

        <Box display="flex" gap={3} className="mb-6 m-10 py-10">
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="moisture">Moisture</MenuItem>
              <MenuItem value="preamibility">Preamibility</MenuItem>
              <MenuItem value="compactibility">Compactibility</MenuItem>
              <MenuItem value="cgs">CGS</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white rounded"
          />
          <TextField
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white rounded"
          />
          {/* <Button
            variant="contained"
            onClick={fetchData}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
        Apply Filters
          </Button> */}
        </Box>
      </Box>

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead className="bg-gray-200">
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={(e) =>
                    setSelectedRows(
                      e.target.checked ? data.map((row) => row.id) : []
                    )
                  }
                  checked={selectedRows.length === data.length}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Reading</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) =>
              row.readings.map((reading) => (
                <TableRow key={reading._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{reading.time}</TableCell>
                  <TableCell>{reading.remark}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedReading({ ...row, readings: [reading] });
                        setType(row.type);
                        setOpenDialog(true);
                      }}
                    >
                      <Edit className="text-blue-600" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row._id, reading._id)}
                    >
                      <Trash2 className="text-red-600" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Reading</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Time"
            margin="normal"
            value={selectedReading?.readings[0].time || ""}
            onChange={(e) =>
              setSelectedReading((prev) => ({
                ...prev,
                readings: [{ ...prev.readings[0], time: e.target.value }],
              }))
            }
            className="border rounded-lg"
          />
          <TextField
            fullWidth
            label="Reading"
            margin="normal"
            type="number"
            value={selectedReading?.readings[0].reading || ""}
            onChange={(e) =>
              setSelectedReading((prev) => ({
                ...prev,
                readings: [
                  { ...prev.readings[0], reading: parseFloat(e.target.value) },
                ],
              }))
            }
            className="border rounded-lg"
          />
          <TextField
            fullWidth
            label="Remark"
            margin="normal"
            value={selectedReading?.readings[0].remark || ""}
            onChange={(e) =>
              setSelectedReading((prev) => ({
                ...prev,
                readings: [{ ...prev.readings[0], remark: e.target.value }],
              }))
            }
            className="border rounded-lg"
          />
          <Select
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            displayEmpty
            margin="normal"
            className="border rounded-lg"
          >
            <MenuItem value="" disabled>
              Select Type
            </MenuItem>
            <MenuItem value="moisture">Moisture</MenuItem>
            <MenuItem value="preamibility">Preamibility</MenuItem>
            <MenuItem value="compactibility">Compactibility</MenuItem>
            <MenuItem value="cgs">CGS</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="default">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RunnerData;
