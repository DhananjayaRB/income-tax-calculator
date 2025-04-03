import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import TaxBreakup from './TaxBreakup';
import TaxComparison from './TaxComparison';

const ResultDisplay = ({ results }) => {
  if (!results) {
    return (
      <Paper elevation={3} style={{ padding: '20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Enter your details and click "Calculate Tax" to see results
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <TaxComparison 
        oldRegimeTax={results.oldRegime.totalTax} 
        newRegimeTax={results.newRegime.totalTax} 
        suggestion={results.suggestion}
      />
      <Box mt={3}>
        <TaxBreakup 
          oldRegime={results.oldRegime} 
          newRegime={results.newRegime} 
        />
      </Box>
    </Box>
  );
};

export default ResultDisplay;