import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddReadingModal = ({ open, onClose, date, onSave }) => {
  const [readings, setReadings] = useState('');

  useEffect(() => {
    setReadings('');
  }, [open]);

  const handleSave = async () => {
    try {
      const readingsArray = readings.split(',').map(Number);
      const data = {
        readings: readingsArray,
        date: date || new Date().toISOString(),
      };

      await axios.post('/api/reading/add-reading', data);
      toast.success('Readings added successfully');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error adding readings');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Readings</DialogTitle>
      <DialogContent>
        <TextField
          label="Readings (comma-separated)"
          fullWidth
          variant="outlined"
          value={readings}
          onChange={(e) => setReadings(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReadingModal;
