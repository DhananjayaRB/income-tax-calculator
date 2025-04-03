import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { 
  Paper, TextField, Button, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Box, 
  Tabs, Tab, Grow, Fade, Slide, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';

// Custom pulse animation
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(46, 125, 50, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 10px rgba(46, 125, 50, 0.6); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(46, 125, 50, 0.4); }
`;

const API_BASE_URL = 'https://uat-api.resolveindia.com/payrun';
const API_ENDPOINT = '/income-tax';

const IncomeTaxCalculator = () => {
  const [inputs, setInputs] = useState({
    totalEarnings: '',
    hraPaid: '',
    section80C: '',
    housingLoan: '',
    chapterVIOthers: '',
    otherIncome: '',
    fbp: ''
  });

  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openBreakup, setOpenBreakup] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (values, name) => {
    setInputs(prev => ({
      ...prev,
      [name]: values.floatValue || ''
    }));
  };

  const handleClear = () => {
    setInputs({
      totalEarnings: '',
      hraPaid: '',
      section80C: '',
      housingLoan: '',
      chapterVIOthers: '',
      otherIncome: '',
      fbp: ''
    });
    setResults(null);
    setError(null);
  };

  const calculateTax = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        financialYear: '2025-2026',
        incomeDetails: {
          ...inputs,
          totalEarnings: inputs.totalEarnings || 0,
          hraPaid: inputs.hraPaid || 0,
          section80C: inputs.section80C || 0,
          housingLoan: inputs.housingLoan || 0,
          chapterVIOthers: inputs.chapterVIOthers || 0,
          otherIncome: inputs.otherIncome || 0,
          fbp: inputs.fbp || 0
        }
      };

      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.success) {
        setResults(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to calculate tax');
      console.error('Tax calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBreakup = (regime) => {
    setSelectedRegime(regime);
    setOpenBreakup(true);
  };

  const handleCloseBreakup = () => {
    setOpenBreakup(false);
  };

  const inputFields = [
    { label: 'Total Earnings', name: 'totalEarnings' },
    { label: 'HRA Paid', name: 'hraPaid' },
    { label: '80C Deductions', name: 'section80C' },
    { label: 'Housing Loan', name: 'housingLoan' },
    { label: 'Chapter VI Others', name: 'chapterVIOthers' },
    { label: 'Other Income', name: 'otherIncome' },
    { label: 'FBP', name: 'fbp' }
  ];

  const colors = {
    primary: '#028CA3',
    secondary: '#028CA3',
    background: '#f5f5f5',
    highlight: '#e3f2fd',
    success: '#028CA3',
    text: '#212121'
  };

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: colors.background,
      gap: '20px'
    }}>
      {/* Left Panel - Input Form (70%) */}
      <Paper elevation={3} style={{
        width: '70%',
        padding: '25px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom style={{ 
            marginBottom: '25px',
            color: colors.primary,
            fontWeight: '600'
          }}>
            Enter Your Salary Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            style={{
              color: colors.secondary,
              borderColor: colors.secondary,
              textTransform: 'none'
            }}
          >
            Clear All
          </Button>
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="secondary"
          textColor="secondary"
        >
          {inputFields.map((field, index) => (
            <Tab 
              key={index} 
              label={field.label} 
              style={{
                fontWeight: activeTab === index ? '600' : '400',
                color: activeTab === index ? colors.secondary : colors.text,
                fontSize: '0.9rem'
              }}
            />
          ))}
        </Tabs>
        
        <Box mt={3}>
          <NumericFormat
            customInput={TextField}
            fullWidth
            label={`${inputFields[activeTab].label} (₹)`}
            variant="outlined"
            name={inputFields[activeTab].name}
            value={inputs[inputFields[activeTab].name]}
            onValueChange={(values) => handleInputChange(values, inputFields[activeTab].name)}
            thousandSeparator={true}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: '20px' }}
            InputProps={{
              style: {
                fontSize: '16px',
                backgroundColor: '#fff'
              }
            }}
          />
        </Box>
        
        <Box mt={2} p={3} bgcolor={colors.highlight} borderRadius="8px">
          <Typography variant="subtitle2" style={{ 
            fontWeight: '600',
            color: colors.primary,
            marginBottom: '10px'
          }}>
            All Input Values:
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
            {inputFields.map((field, index) => (
              <Box key={index}>
                <Typography variant="body2" style={{ marginBottom: '5px' }}>
                  <strong style={{ color: colors.text }}>{field.label}:</strong> 
                  <span style={{ 
                    color: inputs[field.name] ? colors.primary : '#9e9e9e',
                    marginLeft: '5px'
                  }}>
                    {inputs[field.name] ? `₹${Number(inputs[field.name]).toLocaleString('en-IN')}` : 'Not entered'}
                  </span>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="outlined"
            onClick={handleClear}
            style={{ 
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              color: colors.secondary,
              borderColor: colors.secondary
            }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            onClick={calculateTax}
            size="large"
            disabled={loading}
            style={{ 
              padding: '12px 36px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: colors.secondary,
              color: '#fff',
              boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
              minWidth: '200px'
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} style={{ color: '#fff', marginRight: '8px' }} />
                Calculating...
              </>
            ) : 'CALCULATE TAX'}
          </Button>
        </Box>

        {error && (
          <Box mt={2}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Right Panel - Results (30%) */}
      <Paper elevation={3} style={{
        width: '30%',
        padding: '25px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {loading ? (
          <Box 
            display="flex" 
            flexDirection="column"
            alignItems="center" 
            justifyContent="center" 
            height="100%"
            gap={2}
          >
            <CircularProgress size={60} style={{ color: colors.secondary }} />
            <Typography variant="body1" style={{ color: colors.secondary }}>
              Calculating your tax savings...
            </Typography>
          </Box>
        ) : results ? (
          <>
            <Typography variant="h5" gutterBottom style={{ 
              color: colors.primary,
              fontWeight: '600',
              marginBottom: '25px'
            }}>
              Tax Results
            </Typography>
            
            <Box mb={4} p={3} bgcolor={colors.highlight} borderRadius="8px">
              <Typography variant="h6" style={{ 
                color: colors.primary,
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Tax Regime Comparison
              </Typography>
              
              <Box mb={2}>
                <Grow in={true} timeout={500}>
                  <Box 
                    p={3}
                    bgcolor={results.suggestion === 'OLD' ? '#84D4DE' : '#ffffff'}
                    border={results.suggestion === 'OLD' ? `2px solid ${colors.success}` : '1px solid #e0e0e0'}
                    borderRadius="8px"
                    textAlign="center"
                    sx={results.suggestion === 'OLD' ? {
                      animation: `${pulse} 1.5s ease-in-out 2`,
                      transform: 'scale(1.02)'
                    } : {}}
                  >
                    <Typography style={{ fontWeight: '600' }}>Old Regime</Typography>
                    <Typography variant="h5" style={{ 
                      margin: '12px 0',
                      fontWeight: '700',
                      color: results.suggestion === 'OLD' ? colors.success : colors.text
                    }}>
                      ₹{results.oldRegime.totalTaxWithCess.toLocaleString('en-IN')}
                    </Typography>
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenBreakup(results.oldRegime)}
                      style={{
                        marginTop: '8px',
                        color: colors.primary,
                        borderColor: colors.primary
                      }}
                    >
                      View Breakup
                    </Button>
                  </Box>
                </Grow>
              </Box>
              
              <Box mt={2}>
                <Grow in={true} timeout={700}>
                  <Box 
                    p={3}
                    bgcolor={results.suggestion === 'NEW' ? '#84D4DE' : '#ffffff'}
                    border={results.suggestion === 'NEW' ? `2px solid ${colors.success}` : '1px solid #e0e0e0'}
                    borderRadius="8px"
                    textAlign="center"
                    sx={results.suggestion === 'NEW' ? {
                      animation: `${pulse} 1.5s ease-in-out 2`,
                      transform: 'scale(1.02)'
                    } : {}}
                  >
                    <Typography style={{ fontWeight: '600' }}>New Regime</Typography>
                    <Typography variant="h5" style={{ 
                      margin: '12px 0',
                      fontWeight: '700',
                      color: results.suggestion === 'NEW' ? colors.success : colors.text
                    }}>
                      ₹{results.newRegime.totalTaxWithCess.toLocaleString('en-IN')}
                    </Typography>
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenBreakup(results.newRegime)}
                      style={{
                        marginTop: '8px',
                        color: colors.primary,
                        borderColor: colors.primary
                      }}
                    >
                      View Breakup
                    </Button>
                  </Box>
                </Grow>
              </Box>
              
              <Slide direction="up" in={true} timeout={1000}>
                <Box mt={3} textAlign="center">
                  <Typography variant="h6" style={{ 
                    color: colors.success,
                    fontWeight: '600',
                    margin: '15px 0'
                  }}>
                    Better by ₹{results.savings.toLocaleString('en-IN')}
                  </Typography>
                  <Typography style={{ fontWeight: '500' }}>
                    <strong>Recommendation:</strong> The <span style={{ 
                      color: colors.success,
                      fontWeight: '600'
                    }}>{results.suggestion}</span> tax regime is better for you.
                  </Typography>
                </Box>
              </Slide>
            </Box>
          </>
        ) : (
          <Fade in={true} timeout={500}>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
              textAlign="center"
            >
              <Typography variant="body1" style={{ color: '#9e9e9e' }}>
                Enter details and click "CALCULATE TAX" to see results
              </Typography>
            </Box>
          </Fade>
        )}
      </Paper>

      {/* Tax Breakup Dialog */}
      <Dialog
        open={openBreakup}
        onClose={handleCloseBreakup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" style={{ fontWeight: '600' }}>
              Detailed Tax Breakup - {selectedRegime === results?.oldRegime ? 'Old Regime' : 'New Regime'}
            </Typography>
            <IconButton onClick={handleCloseBreakup}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedRegime && (
            <Box>
              <Box mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ fontWeight: '600' }}>Total Earnings:</Typography>
                    <Typography>₹{selectedRegime.grossIncome.toLocaleString('en-IN')}</Typography>
                  </Grid>
				  <Grid item xs={6}>
                      <Typography variant="subtitle1" style={{ fontWeight: '600' }}>Total Exemptions:</Typography>
                      <Typography>₹{selectedRegime.totalDeductions.toLocaleString('en-IN')}</Typography>
                    </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" style={{ fontWeight: '600' }}>Taxable Income:</Typography>
                    <Typography>₹{selectedRegime.taxableIncome.toLocaleString('en-IN')}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="h6" gutterBottom style={{ fontWeight: '600' }}>
                Tax Breakup
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Total Taxable Income</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{(selectedRegime.taxableIncome).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
					<TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Rebate u/s 87A</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{selectedRegime.rebate.toLocaleString('en-IN')}
                      </TableCell>
					  </TableRow>
					<TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Surcharge on Income Tax</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{selectedRegime.surchargeIncome.toLocaleString('en-IN')}
                      </TableCell>
					  </TableRow>
					<TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Tax Including Surcharge</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{selectedRegime.taxIncludingSurchargeIncome.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Education Cess</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{selectedRegime.cess.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Total Tax Liability</TableCell>
                      <TableCell align="right" style={{ fontWeight: '600' }}>
                        ₹{selectedRegime.totalTaxWithCess.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
			   <Typography variant="h6" gutterBottom style={{ fontWeight: '600' }}>
                Tax Slab Details
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
				  <TableRow>
                      <TableCell style={{ fontWeight: '600' }}>Tax Slabs</TableCell>
					   <TableCell align="right" style={{ fontWeight: '600' }}>Tax Rate</TableCell>
                    </TableRow>
					{selectedRegime.taxSlabs.map((slab, index) => (
                      <TableRow key={index}>
                        <TableCell>{slab.range}</TableCell>
                        <TableCell align="right">{slab.tax}</TableCell>
                      </TableRow>
                    ))}
				  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBreakup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IncomeTaxCalculator;