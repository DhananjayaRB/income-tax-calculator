import React from 'react';
import { Paper, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TaxBreakup = ({ oldRegime, newRegime }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>Tax Calculation Breakdown</Typography>
      
      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>Old Tax Regime</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Gross Income</TableCell>
                <TableCell align="right">{oldRegime.grossIncome.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Deductions</TableCell>
                <TableCell align="right">{oldRegime.totalDeductions.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Taxable Income</TableCell>
                <TableCell align="right">{oldRegime.taxableIncome.toLocaleString()}</TableCell>
              </TableRow>
              {oldRegime.taxSlabs.map((slab, index) => (
                <TableRow key={`old-${index}`}>
                  <TableCell>{slab.range}</TableCell>
                  <TableCell align="right">{slab.tax.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell><strong>Total Tax</strong></TableCell>
                <TableCell align="right"><strong>{oldRegime.totalTax.toLocaleString()}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>New Tax Regime</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Gross Income</TableCell>
                <TableCell align="right">{newRegime.grossIncome.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Standard Deduction</TableCell>
                <TableCell align="right">{newRegime.standardDeduction.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Taxable Income</TableCell>
                <TableCell align="right">{newRegime.taxableIncome.toLocaleString()}</TableCell>
              </TableRow>
              {newRegime.taxSlabs.map((slab, index) => (
                <TableRow key={`new-${index}`}>
                  <TableCell>{slab.range}</TableCell>
                  <TableCell align="right">{slab.tax.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell><strong>Total Tax</strong></TableCell>
                <TableCell align="right"><strong>{newRegime.totalTax.toLocaleString()}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default TaxBreakup;