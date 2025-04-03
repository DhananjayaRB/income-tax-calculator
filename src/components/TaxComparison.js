import React from 'react';
import { Paper, Box, Typography, Grid, Button } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const TaxComparison = ({ oldRegimeTax, newRegimeTax, suggestion }) => {
  if (!suggestion) return null;

  const isOldBetter = suggestion === 'old';
  const savings = Math.abs(oldRegimeTax - newRegimeTax);

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h6" gutterBottom>Tax Regime Comparison</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box 
            p={2} 
            style={{ 
              backgroundColor: isOldBetter ? '#e8f5e9' : '#ffebee',
              borderRadius: '4px',
              border: isOldBetter ? '2px solid #4caf50' : '2px solid #f44336'
            }}
          >
            <Typography variant="subtitle1">Old Regime</Typography>
            <Typography variant="h5">₹{oldRegimeTax.toLocaleString()}</Typography>
            {isOldBetter && (
              <Box mt={1} display="flex" alignItems="center">
                <CheckCircle style={{ color: '#4caf50', marginRight: '5px' }} />
                <Typography variant="body2" style={{ color: '#4caf50' }}>
                  Better by ₹{savings.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box 
            p={2} 
            style={{ 
              backgroundColor: !isOldBetter ? '#e8f5e9' : '#ffebee',
              borderRadius: '4px',
              border: !isOldBetter ? '2px solid #4caf50' : '2px solid #f44336'
            }}
          >
            <Typography variant="subtitle1">New Regime</Typography>
            <Typography variant="h5">₹{newRegimeTax.toLocaleString()}</Typography>
            {!isOldBetter && (
              <Box mt={1} display="flex" alignItems="center">
                <CheckCircle style={{ color: '#4caf50', marginRight: '5px' }} />
                <Typography variant="body2" style={{ color: '#4caf50' }}>
                  Better by ₹{savings.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="body1">
          <strong>Recommendation:</strong> The {suggestion} tax regime is better for you as it results in lower tax liability.
        </Typography>
      </Box>
    </Paper>
  );
};

export default TaxComparison;