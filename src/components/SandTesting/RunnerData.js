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
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { Edit, Trash2, FileDown } from "lucide-react";
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

      const response = await axios.get("https://akp.niraj.site/api/runner/runner", {
        params,
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { _id: id, readings } = selectedReading;
      const readingId = readings[0]._id;

      await axios.put(
        `https://akp.niraj.site/api/runner/runnerData/${id}/readings/${readingId}`,
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
        `https://akp.niraj.site/api/runner/runnerData/${id}/readings/${readingId}`
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

    // Remove _id fields and flatten the data structure for export
    const formattedData = exportData.map(({ readings, ...row }) =>
      readings.map((reading) => ({
        date: new Date(row.date).toLocaleDateString(),
        type: row.type,
        reading: reading.reading,
        time: reading.time,
        remark: reading.remark,
      }))
    ).flat();

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <BackButton />
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Runner Data
        </Typography>

        <Button
          variant="contained"
          startIcon={<FileDown />}
          onClick={handleExport}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Export to Excel
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="moisture">Moisture</MenuItem>
                <MenuItem value="preamibility">Preamibility</MenuItem>
                <MenuItem value="compactibility">Compactibility</MenuItem>
                <MenuItem value="cgs">GCS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) =>
                row.readings.map((reading) => (
                  <TableRow key={reading._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                      />
                    </TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{reading.reading}</TableCell>
                    <TableCell>{reading.time}</TableCell>
                    <TableCell>{reading.remark}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedReading({ ...row, readings: [reading] });
                          setType(row.type);
                          setOpenDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row._id, reading._id)}
                      >
                        <Trash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          Update Reading
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Time"
                value={selectedReading?.readings[0].time || ""}
                onChange={(e) =>
                  setSelectedReading((prev) => ({
                    ...prev,
                    readings: [{ ...prev.readings[0], time: e.target.value }],
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reading"
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remark"
                value={selectedReading?.readings[0].remark || ""}
                onChange={(e) =>
                  setSelectedReading((prev) => ({
                    ...prev,
                    readings: [{ ...prev.readings[0], remark: e.target.value }],
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="moisture">Moisture</MenuItem>
                  <MenuItem value="preamibility">Preamibility</MenuItem>
                  <MenuItem value="compactibility">Compactibility</MenuItem>
                  <MenuItem value="cgs">CGS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{ minWidth: 100 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RunnerData;