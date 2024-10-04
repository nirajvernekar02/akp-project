import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const MotionDialog = motion(Dialog);

const AddReadingModal = ({ open, onClose, date, onSave, existingData }) => {
  const [readings, setReadings] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');

  useEffect(() => {
    if (existingData) {
      setReadings(existingData.readings ? existingData.readings.join(', ') : '');
      setUpperLimit(existingData.upperLimit || '');
      setLowerLimit(existingData.lowerLimit || '');
    } else {
      setReadings('');
      setUpperLimit('');
      setLowerLimit('');
    }
  }, [open, existingData]);

  const handleSave = async () => {
    try {
      if (!readings) {
        toast.error('Please enter readings');
        return;
      }

      const readingsArray = readings.split(',').map((reading) => parseFloat(reading.trim()));
      if (readingsArray.some(isNaN)) {
        toast.error('Please enter valid numeric readings');
        return;
      }

      const data = {
        readings: readingsArray,
        date: date || new Date().toISOString(),
        upperLimit: upperLimit ? parseFloat(upperLimit) : undefined,
        lowerLimit: lowerLimit ? parseFloat(lowerLimit) : undefined,
      };

      await axios.post('http://localhost:5500/api/reading/add-reading', data);
      toast.success('Readings added successfully');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error adding readings');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <MotionDialog
          open={open}
          onClose={onClose}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Box position="relative">
            <IconButton
              onClick={onClose}
              style={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle>Add/Edit Readings</DialogTitle>
          <DialogContent>
            <TextField
              label="Readings (comma-separated)"
              fullWidth
              variant="outlined"
              value={readings}
              onChange={(e) => setReadings(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Upper Limit"
              fullWidth
              variant="outlined"
              type="number"
              value={upperLimit}
              onChange={(e) => setUpperLimit(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Lower Limit"
              fullWidth
              variant="outlined"
              type="number"
              value={lowerLimit}
              onChange={(e) => setLowerLimit(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </MotionDialog>
      )}
    </AnimatePresence>
  );
};

export default AddReadingModal;
