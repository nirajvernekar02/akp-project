import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddEditLimitModal = ({ open, onClose, editData, onSave }) => {
  const [upperLimit, setUpperLimit] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');

  useEffect(() => {
    if (editData) {
      setUpperLimit(editData.upperLimit);
      setLowerLimit(editData.lowerLimit);
    } else {
      setUpperLimit('');
      setLowerLimit('');
    }
  }, [editData]);

  const handleSave = async () => {
    try {
      const data = {
        upperLimit: Number(upperLimit),
        lowerLimit: Number(lowerLimit),
      };

      if (editData) {
        await axios.put(`https://akp.niraj.site/api/reading/update/${editData._id}`, data);
      } else {
        await axios.post('https://akp.niraj.site/api/reading/add-reading', data);
      }

      toast.success('Limits saved successfully');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error saving limits');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editData ? 'Edit' : 'Add'} Upper and Lower Limits</DialogTitle>
      <DialogContent>
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
    </Dialog>
  );
};

export default AddEditLimitModal;
