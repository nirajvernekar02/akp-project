import React, { useState, useEffect } from 'react';
import Fishbone from '@hophiphip/react-fishbone';
import '@hophiphip/react-fishbone/style.css';
import { 
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    background: {
      default: '#f5d742',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const initialState = {
  label: "EFFECT",
  children: []
};

const FishboneDiagram = () => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('fishboneData');
      return saved ? JSON.parse(saved) : initialState;
    } catch (error) {
      console.error('Error loading saved data:', error);
      return initialState;
    }
  });

  const [newCategory, setNewCategory] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('fishboneData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [data]);

  const addCategory = () => {
    if (newCategory.trim()) {
      setData(prev => ({
        ...prev,
        children: [
          ...(prev.children || []),
          {
            label: newCategory.toUpperCase(),
            children: []
          }
        ]
      }));
      setNewCategory('');
    }
  };

  const addSubtask = () => {
    if (selectedCategory && newSubtask.trim()) {
      setData(prev => {
        const newData = { ...prev };
        const categoryIndex = prev.children?.findIndex(cat => cat.label === selectedCategory);
        
        if (categoryIndex !== -1) {
          if (!newData.children[categoryIndex].children) {
            newData.children[categoryIndex].children = [];
          }
          newData.children[categoryIndex].children.push({
            label: newSubtask
          });
        }
        return newData;
      });
      setNewSubtask('');
    }
  };

  const deleteCategory = (categoryLabel) => {
    setData(prev => ({
      ...prev,
      children: prev.children.filter(cat => cat.label !== categoryLabel)
    }));
    if (selectedCategory === categoryLabel) {
      setSelectedCategory('');
    }
  };

  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ width: '100%', bgcolor: '#fff7d6' }}>
        <CardHeader
          title={
            <Typography variant="h5" sx={{ 
              textAlign: 'center', 
              color: '#2c3e50',
              fontWeight: 'bold',
              mb: 2 
            }}>
              FISHBONE DIAGRAM
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Category Input Section */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              bgcolor: 'white', 
              p: 2, 
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <TextField
                fullWidth
                size="small"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addCategory)}
                placeholder="Enter category name"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={addCategory}
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: '#2c3e50',
                  '&:hover': { bgcolor: '#1a252f' }
                }}
              >
                Add Category
              </Button>
            </Box>

            {/* Subtask Input Section */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              bgcolor: 'white', 
              p: 2, 
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Select Category"
                >
                  {(data.children || []).map(category => (
                    <MenuItem key={category.label} value={category.label}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                size="small"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addSubtask)}
                placeholder="Enter subtask details"
              />
              <Button
                variant="contained"
                onClick={addSubtask}
                startIcon={<AddIcon />}
                disabled={!selectedCategory}
                sx={{ 
                  bgcolor: '#2c3e50',
                  '&:hover': { bgcolor: '#1a252f' }
                }}
              >
                Add Subtask
              </Button>
            </Box>

            {/* Categories List */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mb: 2 
            }}>
              {data.children.map((category) => (
                <Box
                  key={category.label}
                  sx={{
                    bgcolor: '#2c3e50',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography variant="body2">{category.label}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => deleteCategory(category.label)}
                    sx={{ color: 'white', p: 0.5 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {/* Fishbone Diagram */}
            <Paper 
              elevation={3} 
              sx={{ 
                bgcolor: 'white',
                height: 600,
                borderRadius: 2,
                overflow: 'hidden',
                p: 2
              }}
            >
              <div style={{ width: '100%', height: '100%' }}>
                <Fishbone
                  items={data}
                />
              </div>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default FishboneDiagram;