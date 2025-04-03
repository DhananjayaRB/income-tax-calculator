import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { 
  Paper, TextField, Button, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Box, 
  Tabs, Tab, Grow, Fade, Slide, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  useMediaQuery, useTheme, Chip
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { motion } from 'framer-motion';

// Custom styled components with new color theme
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
  color: '#FFFFFF',
  fontWeight: 800,
  padding: '12px 32px',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(74, 0, 224, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(74, 0, 224, 0.4)',
    background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 80%)'
  },
  '&.Mui-disabled': {
    background: '#B0BEC5',
    color: '#ECEFF1'
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: '2px solid #4A00E0',
  color: '#4A00E0',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(74, 0, 224, 0.08)',
    border: '2px solid #4A00E0'
  }
}));

// Custom animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(74, 0, 224, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 20px rgba(74, 0, 224, 0.6); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(74, 0, 224, 0.4); }
`;

const API_BASE_URL = 'https://uat-api.resolveindia.com/payrun';
const API_ENDPOINT = '/income-tax';

const IncomeTaxCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [inputs, setInputs] = useState({
    totalEarnings: '',
    hraPaid: '',
    section80C: '',
    pf: '',
    vpf: '',
    others80C: '',
    housingLoan: '',
    chapterVIOthers: '',
    section80D: '',
    section80DD: '',
    section80U: '',
    section80DDB: '',
    section80EEA: '',
    section80EEB: '',
    section80E: '',
    section80CCD1B: '',
    employernps80ccd1b: '',
    otherIncome: '',
    fbp: ''
  });

  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openBreakup, setOpenBreakup] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [showSlabs, setShowSlabs] = useState(false);

  const inputFields = [
    { label: 'Total Earnings', name: 'totalEarnings' },
    { label: 'Rent Paid', name: 'hraPaid' },
    { label: '80 C', name: 'section80C' },
    { label: 'Housing Loan', name: 'housingLoan' },
    { label: 'Other Chapter VI A', name: 'chapterVIOthers' },
    { label: 'Other Sources Income', name: 'otherIncome' },
    { label: 'FBP', name: 'fbp' }
  ];

  // New color theme
  const colors = {
    primary: '#1976D2',       // Primary blue (Material-UI default)
    secondary: '#0D47A1',     // Darker blue
    accent: '#42A5F5',        // Lighter blue
    background: '#F5F9FF',    // Very light blue background
    highlight: '#E3F2FD',     // Light blue highlight
    success: '#4CAF50',       // Green (unchanged)
    error: '#F44336',         // Red (unchanged)
    warning: '#FFA726',       // Orange for warnings
    text: '#263238',          // Dark gray for text
    lightText: '#607D8B',     // Medium gray for secondary text
    oldRegime: '#1976D2',     // Blue for old regime
    newRegime: '#00ACC1',     // Teal for new regime (good contrast)
    border: '#CFD8DC',        // Light gray for borders
    white: '#FFFFFF',
    darkBlue: '#0D47A1'       // For important accents
  };

  // Calculate total 80C whenever PF, VPF or Others change
  useEffect(() => {
    const total80C = Math.min(
      Number(inputs.pf || 0) + Number(inputs.vpf || 0) + Number(inputs.others80C || 0),
      150000
    );
    setInputs(prev => ({
      ...prev,
      section80C: total80C
    }));
  }, [inputs.pf, inputs.vpf, inputs.others80C]);

  // Calculate total Chapter VI A whenever any of its sub-sections change
  useEffect(() => {
    const totalChapterVI = 
      Number(inputs.section80D || 0) + 
      Number(inputs.section80DD || 0) + 
      Number(inputs.section80U || 0) + 
      Number(inputs.section80DDB || 0) + 
      Number(inputs.section80EEA || 0) + 
      Number(inputs.section80EEB || 0) + 
      Number(inputs.section80E || 0) + 
      Number(inputs.section80CCD1B || 0)+
      Number(inputs.employernps80ccd1b || 0);
    
    setInputs(prev => ({
      ...prev,
      chapterVIOthers: totalChapterVI
    }));
  }, [
    inputs.section80D, 
    inputs.section80DD, 
    inputs.section80U, 
    inputs.section80DDB,
    inputs.section80EEA,
    inputs.section80EEB,
    inputs.section80E,
    inputs.section80CCD1B,
    inputs.employernps80ccd1b
  ]);

  // Auto-calculate tax when inputs change
  useEffect(() => {
    if (inputs.totalEarnings> 0) {
    if (autoCalculate && Object.values(inputs).some(val => val !== '')) {
      const timer = setTimeout(() => {
        calculateTax();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
  }
  }, [inputs, autoCalculate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (values, name) => {
    const value = values.floatValue || '';
    
    let limitedValue = value;
    switch(name) {
      case 'housingLoan':
        limitedValue = Math.min(value, 200000);
        break;
      case 'section80D':
        limitedValue = Math.min(value, 100000);
        break;
      case 'section80DD':
      case 'section80U':
        limitedValue = Math.min(value, 200000);
        break;
      case 'section80DDB':
        limitedValue = Math.min(value, 140000);
        break;
      case 'section80EEA':
      case 'section80EEB':
        limitedValue = Math.min(value, 150000);
        break;
      case 'section80CCD1B':
        limitedValue = Math.min(value, 50000);
        break;
      case 'section80E':
        // No limit for education loan
        limitedValue = value;
        break;
        case 'employernps80ccd1b':
          // No limit for education loan
          limitedValue = value;
          break;
      default:
        limitedValue = value;
    }

    setInputs(prev => ({
      ...prev,
      [name]: limitedValue
    }));
  };

  const handleClear = () => {
    setInputs({
      totalEarnings: '',
      hraPaid: '',
      section80C: '',
      pf: '',
      vpf: '',
      others80C: '',
      housingLoan: '',
      chapterVIOthers: '',
      section80D: '',
      section80DD: '',
      section80U: '',
      section80DDB: '',
      section80EEA: '',
      section80EEB: '',
      section80E: '',
      section80CCD1B: '',
      employernps80ccd1b: '',
      otherIncome: '',
      fbp: ''
    });
    setResults(null);
    setError(null);
    setAutoCalculate(false);
  };

  const calculateTax = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        financialYear: '2025-2026',
        incomeDetails: {
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
      setAutoCalculate(true);
    }
  };

  const handleOpenBreakup = (regime) => {
    setSelectedRegime(regime);
    setOpenBreakup(true);
    setShowSlabs(false);
  };

  const handleCloseBreakup = () => {
    setOpenBreakup(false);
  };

  const handle80CButtonClick = (type) => {
    let value = 0;
    switch(type) {
      case 'pf':
        value = 150000;
        break;
      case 'vpf':
        value = 150000;
        break;
      case 'others80C':
        value = 150000;
        break;
      default:
        value = 0;
    }
    setInputs(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const renderInputField = () => {
    switch(activeTab) {
      case 0: // Total Earnings
      case 1: // Rent Paid
      case 5: // Other Sources Income
      case 6: // FBP
        return (
          <NumericFormat
            customInput={TextField}
            fullWidth
            label={`${inputFields[activeTab].label} (₹)`}
            variant="outlined"
            name={inputFields[activeTab].name}
            value={inputs[inputFields[activeTab].name]}
            onValueChange={(values) => handleInputChange(values, inputFields[activeTab].name)}
            thousandSeparator={true}
            InputLabelProps={{ 
              shrink: true,
              style: {
                color: colors.lightText,
                fontWeight: '500'
              }
            }}
            InputProps={{
              style: {
                fontSize: '16px',
                backgroundColor: '#fff',
                borderRadius: '12px'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: colors.accent,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colors.primary,
                  borderWidth: '2px'
                },
              }
            }}
          />
        );
      case 2: // 80C Tab
        return (
          <Box>
            <Box mb={2}>
              <Typography variant="body1" color={colors.primary} fontWeight="600" mb={1}>
                Max Eligibility: ₹1,50,000
              </Typography>
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <Button 
                  variant="outlined" 
                  onClick={() => handle80CButtonClick('pf')}
                  sx={{ textTransform: 'none' }}
                >
                  PF (₹{inputs.pf || 0})
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => handle80CButtonClick('vpf')}
                  sx={{ textTransform: 'none' }}
                >
                  VPF (₹{inputs.vpf || 0})
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => handle80CButtonClick('others80C')}
                  sx={{ textTransform: 'none' }}
                >
                  Others (₹{inputs.others80C || 0})
                </Button>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={3}>
              <NumericFormat
                customInput={TextField}
                label="PF (₹)"
                variant="outlined"
                name="pf"
                value={inputs.pf}
                onValueChange={(values) => handleInputChange(values, 'pf')}
                thousandSeparator={true}
                fullWidth
              />
              <NumericFormat
                customInput={TextField}
                label="VPF (₹)"
                variant="outlined"
                name="vpf"
                value={inputs.vpf}
                onValueChange={(values) => handleInputChange(values, 'vpf')}
                thousandSeparator={true}
                fullWidth
              />
              <NumericFormat
                customInput={TextField}
                label="Others (₹)"
                variant="outlined"
                name="others80C"
                value={inputs.others80C}
                onValueChange={(values) => handleInputChange(values, 'others80C')}
                thousandSeparator={true}
                fullWidth
              />
            </Box>
            <Box p={2} bgcolor={colors.highlight} borderRadius="12px">
              <Typography variant="body1" fontWeight="600">
                Total 80C: ₹{inputs.section80C.toLocaleString('en-IN')} / ₹1,50,000
              </Typography>
            </Box>
          </Box>
        );
      case 3: // Housing Loan
        return (
          <Box>
            <NumericFormat
              customInput={TextField}
              fullWidth
              label="Housing Loan (₹)"
              variant="outlined"
              name="housingLoan"
              value={inputs.housingLoan}
              onValueChange={(values) => handleInputChange(values, 'housingLoan')}
              thousandSeparator={true}
              helperText={`Max limit: ₹2,00,000 (Current: ₹${inputs.housingLoan || 0})`}
              InputProps={{
                endAdornment: (
                  <Chip 
                    label="Max" 
                    size="small" 
                    onClick={() => handleInputChange({ floatValue: 200000 }, 'housingLoan')}
                    sx={{ cursor: 'pointer' }}
                  />
                )
              }}
            />
          </Box>
        );
      case 4: // Other Chapter VI A
        return (
          <Box>
            <Typography variant="body1" color={colors.primary} fontWeight="600" mb={2}>
              Other Deductions under Chapter VI A
            </Typography>
            
            <Box display="grid" gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"} gap={2} mb={3}>
              {/* 80D - Health Insurance */}
              <NumericFormat
                customInput={TextField}
                label="80D - Health Insurance (₹)"
                variant="outlined"
                name="section80D"
                value={inputs.section80D}
                onValueChange={(values) => handleInputChange(values, 'section80D')}
                thousandSeparator={true}
                helperText="Max: ₹1,00,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 100000 }, 'section80D')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80DD - Handicapped Dependents */}
              <NumericFormat
                customInput={TextField}
                label="80DD - Handicapped Dependents (₹)"
                variant="outlined"
                name="section80DD"
                value={inputs.section80DD}
                onValueChange={(values) => handleInputChange(values, 'section80DD')}
                thousandSeparator={true}
                helperText="Max: ₹2,00,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 200000 }, 'section80DD')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80U - Permanent Disability */}
              <NumericFormat
                customInput={TextField}
                label="80U - Permanent Disability (₹)"
                variant="outlined"
                name="section80U"
                value={inputs.section80U}
                onValueChange={(values) => handleInputChange(values, 'section80U')}
                thousandSeparator={true}
                helperText="Max: ₹2,00,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 200000 }, 'section80U')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80DDB - Terminal Disease */}
              <NumericFormat
                customInput={TextField}
                label="80DDB - Terminal Disease (₹)"
                variant="outlined"
                name="section80DDB"
                value={inputs.section80DDB}
                onValueChange={(values) => handleInputChange(values, 'section80DDB')}
                thousandSeparator={true}
                helperText="Max: ₹1,40,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 140000 }, 'section80DDB')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80EEA - First Home Buyers */}
              <NumericFormat
                customInput={TextField}
                label="80EEA - First Home Buyers (₹)"
                variant="outlined"
                name="section80EEA"
                value={inputs.section80EEA}
                onValueChange={(values) => handleInputChange(values, 'section80EEA')}
                thousandSeparator={true}
                helperText="Max: ₹1,50,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 150000 }, 'section80EEA')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80EEB - Electric Vehicle */}
              <NumericFormat
                customInput={TextField}
                label="80EEB - Electric Vehicle (₹)"
                variant="outlined"
                name="section80EEB"
                value={inputs.section80EEB}
                onValueChange={(values) => handleInputChange(values, 'section80EEB')}
                thousandSeparator={true}
                helperText="Max: ₹1,50,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 150000 }, 'section80EEB')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />

              {/* 80E - Education Loan */}
              <NumericFormat
                customInput={TextField}
                label="80E - Education Loan (₹)"
                variant="outlined"
                name="section80E"
                value={inputs.section80E}
                onValueChange={(values) => handleInputChange(values, 'section80E')}
                thousandSeparator={true}
                helperText="No limit"
                fullWidth
              />

              {/* 80CCD(1B) - NPS */}
              <NumericFormat
                customInput={TextField}
                label="80CCD(1B) - NPS (₹)"
                variant="outlined"
                name="section80CCD1B"
                value={inputs.section80CCD1B}
                onValueChange={(values) => handleInputChange(values, 'section80CCD1B')}
                thousandSeparator={true}
                helperText="Max: ₹50,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 50000 }, 'section80CCD1B')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
              />
              {/* Employeer - NPS */}
              <NumericFormat
                customInput={TextField}
                label="Employeer - NPS 80CCD(2B) (₹)"
                variant="outlined"
                name="employernps80ccd1b"
                value={inputs.employernps80ccd1b}
                onValueChange={(values) => handleInputChange(values, 'employernps80ccd1b')}
                thousandSeparator={true}
                helperText=""
                fullWidth
              />
            </Box>
            
            <Box p={2} bgcolor={colors.highlight} borderRadius="12px">
              <Typography variant="body1" fontWeight="600">
                Total Chapter VI A Deductions: ₹{inputs.chapterVIOthers.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        padding: isMobile ? '16px' : '24px',
        boxSizing: 'border-box',
        backgroundColor: colors.background,
        gap: '24px'
      }}
    >
      {/* Left Panel - Input Form */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{ 
          width: isMobile ? '100%' : '70%',
          flexShrink: 0
        }}
      >
        <StyledPaper elevation={0}>
          <Box p={isMobile ? 2 : 3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" style={{ 
                color: colors.primary,
                fontWeight: '700',
                letterSpacing: '-0.5px'
              }}>
                Income Tax Calculator
              </Typography>
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                style={{
                  color: colors.primary,
                  textTransform: 'none',
                  fontWeight: '600'
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
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  height: '4px',
                  borderRadius: '4px 4px 0 0'
                }
              }}
            >
              {inputFields.map((field, index) => (
                <Tab 
                  key={index} 
                  label={field.label} 
                  sx={{
                    fontWeight: activeTab === index ? '700' : '500',
                    fontSize: '0.9rem',
                    minWidth: 'unset',
                    px: 2,
                    textTransform: 'none'
                  }}
                />
              ))}
            </Tabs>
            
            <Box mt={3}>
              {renderInputField()}
            </Box>
            
            <Box mt={3} p={3} bgcolor={colors.highlight} borderRadius="12px">
              <Typography variant="subtitle1" style={{ 
                fontWeight: '600',
                color: colors.primary,
                marginBottom: '12px'
              }}>
                Summary of Inputs
              </Typography>
              <Box display="grid" gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"} gap={1.5}>
                {inputFields.map((field, index) => (
                  <Box key={index}>
                    <Typography variant="body2" style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: colors.text, fontWeight: '500' }}>{field.label}:</span> 
                      <span style={{ 
                        color: inputs[field.name] ? colors.primary : colors.lightText,
                        fontWeight: '600'
                      }}>
                        {inputs[field.name] ? `₹${Number(inputs[field.name]).toLocaleString('en-IN')}` : 'Not entered'}
                      </span>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
              <PrimaryButton 
                onClick={calculateTax} 
                disabled={loading} 
                style={{ color: '#FFFFFF', marginRight: '8px'}}
              >
                {loading ? (
                  <>
                    <CircularProgress 
                      size={24} 
                      style={{ 
                        color: '#FFFFFF',
                        marginRight: '18px' 
                      }} 
                    />
                    Calculating...
                  </>
                ) : 'Calculate Tax'}
              </PrimaryButton>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box mt={3}>
                  <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{
                      borderRadius: '12px',
                      borderLeft: `4px solid ${colors.error}`
                    }}
                  >
                    {error}
                  </Alert>
                </Box>
              </motion.div>
            )}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* Right Panel - Results */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        style={{ 
          width: isMobile ? '100%' : '30%',
          flexShrink: 0
        }}
      >
        <StyledPaper elevation={0}>
          <Box p={isMobile ? 2 : 3}>
            {loading ? (
              <Box 
                display="flex" 
                flexDirection="column"
                alignItems="center" 
                justifyContent="center" 
                height="300px"
                gap={2}
              >
                <CircularProgress size={60} thickness={4} style={{ color: colors.primary }} />
                <Typography variant="body1" style={{ 
                  color: colors.primary,
                  fontWeight: '500'
                }}>
                  Calculating your tax savings...
                </Typography>
              </Box>
            ) : results ? (
              <>
                <Typography variant="h5" style={{ 
                  color: colors.primary,
                  fontWeight: '700',
                  marginBottom: '24px',
                  letterSpacing: '-0.5px'
                }}>
                  Tax Results
                </Typography>
                
                <Box mb={4}>
                  <Typography variant="h6" style={{ 
                    color: colors.text,
                    fontWeight: '600',
                    marginBottom: '16px'
                  }}>
                    Tax Regime Comparison
                  </Typography>
                  
                  <Box mb={3}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Box 
                        p={3}
                        sx={{
                          background: results.suggestion === 'OLD' 
                            ? 'linear-gradient(135deg, #00c853 0%, #b2ff59 100%)'  // Green success gradient
                            : 'linear-gradient(135deg, #f4f0ec , #bebebe   )',
                          border: results.suggestion === 'OLD' 
                            ? `2px solid ${colors.white}` 
                            : '1px solid #e2e8f0',
                          borderRadius: "12px",
                          textAlign: "center",
                          color: "#fff", // White text for better contrast
                          fontWeight: "bold",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                          },
                          ...(results.suggestion === "OLD" && {
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }),
                        }}
                      >
                     {results.suggestion === "OLD" && (
                        <CheckCircleIcon sx={{
                          position: "absolute",
                          top: "-10px",
                          right: "-4px",
                          color: colors.darkBlue, 
                          fontSize: 30,
                        }}  />
                      )}
                        <Typography style={{ 
                          fontWeight: '600',
                          color: colors.darkBlue
                        }}>
                          Old Regime
                        </Typography>
                        <Typography variant="h4" style={{ 
                          margin: '12px 0',
                          fontWeight: '700',
                          color: colors.darkBlue
                        }}>
                          ₹{results.oldRegime.totalTaxWithCess.toLocaleString('en-IN')}
                        </Typography>
                        <SecondaryButton 
                          size="small"
                          onClick={() => handleOpenBreakup(results.oldRegime)}
                          style={{
                            marginTop: '8px',
                            minWidth: '120px',
                            borderColor: colors.accent,
                            background:colors.warning,
                            color: colors.darkBlue
                          }}
                        >
                          View Details
                        </SecondaryButton>
                      </Box>
                    </motion.div>
                  </Box>
                  
                  <Box mb={3}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                     <Box 
                        p={3}
                        sx={{
                          background: results.suggestion === 'NEW' 
                          ? 'linear-gradient(135deg, #009b7d  0%, #b2ff59 100%)'  // Green success gradient  // Green success gradient  // Green success gradient
                          : 'linear-gradient(135deg, #f4f0ec , #bebebe   )',
                          border: results.suggestion === 'NEW' 
                            ? `2px solid ${colors.white}` 
                            : '1px solid #e2e8f0',
                          borderRadius: "12px",
                          textAlign: "center",
                          color: "#fff", // White text for better contrast
                          fontWeight: "bold",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                          },
                          ...(results.suggestion === "NEW" && {
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }),
                        }}
                      >
                          {results.suggestion === "NEW" && (
                        <CheckCircleIcon sx={{
                          position: "absolute",
                          top: "-10px",
                          right: "-4px",
                          color: colors.darkBlue, 
                          fontSize: 30,
                        }}  />
                      )}
                        <Typography style={{ 
                          fontWeight: '600',
                          color: colors.darkBlue
                        }}>
                          New Regime
                        </Typography>
                        <Typography variant="h4" style={{ 
                          margin: '12px 0',
                          fontWeight: '700',
                          color: colors.darkBlue
                        }}>
                          ₹{results.newRegime.totalTaxWithCess.toLocaleString('en-IN')}
                        </Typography>
                        <SecondaryButton 
                          size="small"
                          onClick={() => handleOpenBreakup(results.newRegime)}
                          style={{
                            marginTop: '8px',
                            minWidth: '120px',
                            borderColor: colors.accent,
                            background:colors.warning,
                            color: colors.darkBlue
                          }}
                        >
                          View Details
                        </SecondaryButton>
                      </Box>
                    </motion.div>
                  </Box>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box 
                      p={3} 
                      bgcolor={colors.highlight} 
                      borderRadius="12px"
                      textAlign="center"
                    >
                      <Typography variant="h6" style={{ 
                        color: colors.primary,
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}>
                       You save  <fontSize style={{ 
                        color: colors.secondary,
                        fontSize: '30px'
                      }}>₹{results.savings.toLocaleString('en-IN')}</fontSize>
                      </Typography>
                      <Typography style={{ fontWeight: '500' }}>
                        <strong>Recommendation:</strong> The{' '}
                        <span style={{ 
                          color: results.suggestion === 'OLD' ? colors.oldRegime : colors.newRegime,
                          fontWeight: '600',
                          fontSize: '20px',
                          textTransform: 'capitalize'
                        }}>
                          {results.suggestion.toLowerCase()}
                          {' '}Tax Regime </span>{' '}Is Better For You
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column"
                alignItems="center" 
                justifyContent="center" 
                height="300px"
                textAlign="center"
                p={3}
              >
                <img 
                  src="https://resolvepay.blob.core.windows.net/devresolvepay/vecteezy_tax-form-icon-fill-tax-form-icon_21459716.png" 
                  alt="Tax illustration" 
                  width="120" 
                  style={{ opacity: 0.6, marginBottom: '16px' }}
                />
                <Typography variant="body1" style={{ 
                  color: colors.lightText,
                  maxWidth: '300px'
                }}>
                  Enter your salary details to see your tax regime comparison
                </Typography>
              </Box>
            )}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* Tax Breakup Dialog */}
      <Dialog
        open={openBreakup}
        onClose={handleCloseBreakup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px'
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle sx={{ 
            backgroundColor: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
            color: 'white',
            padding: '16px 24px'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                Detailed Tax Breakup - {selectedRegime === results?.oldRegime ? 'Old Regime' : 'New Regime'}
              </Typography>
              <IconButton 
                onClick={handleCloseBreakup}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ padding: 0 }}>
            {selectedRegime && (
              <Box>
                <Box p={3}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: '600',
                    color: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
                    mb: 2
                  }}>
                    Income Breakup
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Total Earnings</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime.grossIncome.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) FBP Reimbursement</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : (inputs.fbp || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Exemptions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : (inputs.hraPaid || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Standard Deductions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.oldRegime ? '50,000' : '75,000'}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Professional Tax</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.oldRegime ? '2,400' : '0'}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Housing Loan</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : (inputs.housingLoan || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(+) Other Source Of Income</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' :(inputs.otherIncome || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) 80 C</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : (inputs.section80C || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Other Chapter VI A</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : (inputs.chapterVIOthers || 0).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow sx={{ 
                          backgroundColor: colors.highlight,
                          '& td': {
                            fontWeight: '700',
                            fontSize: '1.1rem'
                          }
                        }}>
                          <TableCell>Taxable Income</TableCell>
                          <TableCell align="right">
                            ₹{selectedRegime.taxableIncome.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Rebate u/s 87A</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime.rebate.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Surcharge</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime.surchargeIncome.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Tax + Surcharge</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime.taxIncludingSurchargeIncome.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Education Cess</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime.cess.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow sx={{ 
                          backgroundColor: colors.highlight,
                          '& td': {
                            fontWeight: '700',
                            fontSize: '1.1rem'
                          }
                        }}>
                          <TableCell>Total Tax Liability</TableCell>
                          <TableCell align="right">
                            ₹{selectedRegime.totalTaxWithCess.toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ 
                          backgroundColor: colors.highlight,
                          '& td': {
                            fontWeight: '700',
                            fontSize: '1.1rem'
                          }
                        }}>
                          <TableCell>Monthly Tax Liability</TableCell>
                          <TableCell align="right">
                            ₹{Math.round(selectedRegime.totalTaxWithCess/12).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box mt={3} display="flex" justifyContent="center">
                    <Button 
                      variant="outlined"
                      onClick={() => setShowSlabs(!showSlabs)}
                      sx={{ 
                        textTransform: 'none',
                        color: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
                        borderColor: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime
                      }}
                    >
                      {showSlabs ? 'Hide Tax Slabs' : 'View Tax Slab Breakup'}
                    </Button>
                  </Box>
                  
                  {showSlabs && (
                    <Box mt={3}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: '600',
                        color: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
                        mb: 2
                      }}>
                        Tax Slab Rates ({selectedRegime === results?.oldRegime ? 'Old Regime' : 'New Regime'})
                      </Typography>
                      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Table>
                          <TableHead sx={{ backgroundColor: colors.highlight }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: '600' }}>Income Range</TableCell>
                              <TableCell align="right" sx={{ fontWeight: '600' }}>Tax Rate</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedRegime.taxSlabs.map((slab, index) => (
                              <TableRow 
                                key={index}
                                hover
                                sx={{ 
                                  '&:nth-of-type(odd)': { backgroundColor: '#ffffff' },
                                  '&:nth-of-type(even)': { backgroundColor: colors.highlight }
                                }}
                              >
                                <TableCell>{slab.range}</TableCell>
                                <TableCell align="right">{slab.tax}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <SecondaryButton 
              onClick={handleCloseBreakup}
              sx={{
                color: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
                borderColor: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime
              }}
            >
              Close
            </SecondaryButton>
          </DialogActions>
        </motion.div>
      </Dialog>
    </motion.div>
  );
};
export default IncomeTaxCalculator;