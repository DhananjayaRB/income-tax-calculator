/* eslint-env es2020 */
import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
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
import Confetti from 'react-confetti';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CryptoJS from 'crypto-js';
import { Snackbar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ClipLoader from "react-spinners/ClipLoader";

const dotFlashing = keyframes`
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '..'; }
  100% { content: '...'; }
`;

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const bounceFade = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(-10px) scale(1.05); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 0.8; }
`;

const pulseGlow = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0px #FFD700); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 8px #FFD700); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0px #FFD700); }
`;

// Usage:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${pulseGlow} 3s ease-in-out infinite`,
  color: '#FFA500'
}} />

const rotate3D = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

// Usage:
<Box sx={{
  display: 'inline-block',
  animation: `${rotate3D} 4s linear infinite`,
  transformStyle: 'preserve-3d'
}}>
  <CelebrationIcon sx={{ mr: 1 }} />
</Box>

const floatShadow = keyframes`
  0%, 100% { 
    transform: translateY(0);
    filter: drop-shadow(0 5px 5px rgba(0,0,0,0.2));
  }
  50% { 
    transform: translateY(-10px);
    filter: drop-shadow(0 15px 10px rgba(0,0,0,0.3));
  }
`;

// Usage:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${floatShadow} 3s ease-in-out infinite`
}} />

const breathe = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

// Usage:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${breathe} 4s ease-in-out infinite`
}} />

const confettiBurst = keyframes`
  0% { transform: scale(0); opacity: 0; }
  20% { transform: scale(1.2); opacity: 1; }
  40% { transform: scale(0.9); }
  60% { transform: scale(1.1); }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
`;

// Usage:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${confettiBurst} 1.5s ease-out forwards`,
  transformOrigin: 'center'
}} />

const celebrate = keyframes`
  0% { 
    transform: translateY(0) rotate(0deg) scale(1);
    filter: drop-shadow(0 0 0px gold);
  }
  25% { 
    transform: translateY(-8px) rotate(5deg) scale(1.05);
    filter: drop-shadow(0 0 5px gold);
  }
  50% { 
    transform: translateY(-5px) rotate(-5deg) scale(1.1);
    filter: drop-shadow(0 0 10px gold);
  }
  75% { 
    transform: translateY(-8px) rotate(5deg) scale(1.05);
    filter: drop-shadow(0 0 5px gold);
  }
  100% { 
    transform: translateY(0) rotate(0deg) scale(1);
    filter: drop-shadow(0 0 0px gold);
  }
`;

// Usage:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${celebrate} 2s ease-in-out infinite`,
  color: '#FFD700'
}} />

// Add to your animations section
const celebrateIcon = keyframes`
  0%, 100% { 
    transform: translateY(0) rotate(0deg) scale(1);
    filter: drop-shadow(0 0 0px rgba(255, 215, 0, 0.5));
  }
  25% { 
    transform: translateY(-6px) rotate(5deg) scale(1.08);
    filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.7));
  }
  50% { 
    transform: translateY(-3px) rotate(-5deg) scale(1.12);
    filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.9));
  }
  75% { 
    transform: translateY(-6px) rotate(5deg) scale(1.08);
    filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.7));
  }
`;

// In your WelcomeCard component:
<CelebrationIcon sx={{
  mr: 1,
  animation: `${celebrateIcon} 2.5s ease-in-out infinite`,
  color: '#FFD700',
  fontSize: '2.5rem'
}} />

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

const fireworks = keyframes`
  0% { 
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  70% {
    opacity: 0.8;
  }
  100% { 
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
`;

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)'
  }
}));

const WelcomeCard = muiStyled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #02569B 0%, #13B9FD 100%)', // light blue-grey,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(74, 0, 224, 0.3)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    animation: `${floatAnimation} 8s infinite linear`,
  }
}));

const FireworkParticle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  animation: ${fireworks} 1.5s ease-out forwards;
  bottom: 0;
  will-change: transform, opacity;
`;

const PrintStyles = styled.div`
  @media print {
    body * {
      visibility: hidden;
    }
    .printable-area, .printable-area * {
      visibility: visible;
    }
    .printable-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    button {
      display: none !important;
    }
  }
`;

const FloatingDownloadButton = muiStyled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(5),
  right: theme.spacing(15),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: theme.shadows[6],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8],
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
  zIndex: 1000,
  width: 50,
  height: 50,
  animation:'blink',
  '&.Mui-disabled': {
    backgroundColor: theme.palette.grey[400],
  }
}));

const ExitButton = muiStyled(IconButton)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(-1),
  right: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: theme.shadows[6],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[8],
    transform: 'scale(1.1)',
  },
  zIndex: 1000,
  width: 50,
  height: 50
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
  border: '2px solid #028CA3',
  color: '#028CA3',
  fontWeight: 600,
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(2, 140, 163, 0.08)',
    border: '2px solid #028CA3'
  }
}));


const API_BASE_URL = 'https://apiv1.resolvepay.in/payrun';
const API_ENDPOINT = '/income-tax';
const EMPLOYEE_DETAILS_ENDPOINT = '/get-employee-details-ency';

const params = new URLSearchParams(window.location.search);
var url = params.get("uid");

var getuserid=0;
var getNewUser=0;
const skey = "TrtgdhYvbfdasmyghRchprcsvFsngabV"; // 32 chars
const siv = "6581256789036528"; // 16 chars

// Base62 charset
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Utility: Convert WordArray → Uint8Array
const wordArrayToUint8Array = (wordArray) => {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
};

// Utility: Convert Uint8Array → WordArray
const uint8ArrayToWordArray = (u8arr) => {
  const words = [];
  for (let i = 0; i < u8arr.length; i++) {
    words[i >>> 2] |= u8arr[i] << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, u8arr.length);
};

// Base62 encode
const toBase62 = (u8arr) => {
  let value = BigInt("0x" + [...u8arr].map(b => b.toString(16).padStart(2, '0')).join(''));
  if (value === 0n) return "0";
  let result = '';
  while (value > 0n) {
    const rem = value % 62n;
    result = BASE62_CHARS[Number(rem)] + result;
    value = value / 62n;
  }
  return result;
};

// Base62 decode
const fromBase62 = (str) => {
  let value = 0n;
  for (let i = 0; i < str.length; i++) {
    value = value * 62n + BigInt(BASE62_CHARS.indexOf(str[i]));
  }

  let hex = value.toString(16);
  if (hex.length % 2 !== 0) hex = '0' + hex;

  const u8arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < u8arr.length; i++) {
    u8arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return u8arr;
};

// AES Encrypt (Base62 output)
const encryptAES = (text, key, iv) => {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

  const encrypted = CryptoJS.AES.encrypt(text, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const bytes = wordArrayToUint8Array(encrypted.ciphertext);
  return toBase62(bytes);
};

// AES Decrypt (Base62 input)
const decryptAES = (base62Text, key, iv) => {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

  const u8arr = fromBase62(base62Text);
  const wordArray = uint8ArrayToWordArray(u8arr);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: wordArray }, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encrypted = encryptAES("58368", skey, siv);

const decrypted = decryptAES(encrypted, skey, siv);

const userid=url;
const IncomeTaxCalculator = () => {
  const theme = useTheme();
  const printRef = useRef();
  const employeeName="";
  const employeeNumber="";
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dateIn = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateInIST=dateIn.replace(/am|pm/i, match => match.toUpperCase());
  const handleDownloadPdf = async () => {
    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!printRef.current) {
        throw new Error('Element not found');
      }
  
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (el) => el.classList.contains('ignore-on-export')
      });
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
   
const now = new Date();
// Convert to IST
const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
const istTime = new Date(now.getTime() + istOffset);
// Format date and time parts
const pad = (n) => n.toString().padStart(2, '0');
let hours = istTime.getUTCHours();
const minutes = pad(istTime.getUTCMinutes());
const seconds = pad(istTime.getUTCSeconds());
const day = pad(istTime.getUTCDate());
const month = pad(istTime.getUTCMonth() + 1);
const year = istTime.getUTCFullYear();
// AM/PM logic
const ampm = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12; // convert to 12-hour format
hours = pad(hours);
// Final datetime string: YYYYMMDD_HHMMSS_AMPM
const formattedDateTime = `${year}_${month}_${day}_${hours}_${minutes}_${ampm}`;
// Clean employee name (remove spaces)
const cleanName = employee.employeeName.replace(/\s+/g, '');
// Final filename
const filename = `${cleanName}_${formattedDateTime}`;
pdf.save(filename);
      
      // Optional: Show success message
      setError(null);
      setSuccess('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const handleExit = () => {
      window.location.href = 'https://services.resolvepay.in/dashboard/';
    };
  

    const handleRating = (value) => {
      setRating(value);
      sendRatingToApi(value);
      setSubmitted(true);
    };
  
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
  
    const handleRatingClick = (value) => {
      setRating(value);
      sendRatingToApi(value);
      setSubmitted(true);
    };
    const sendRatingToApi = async (value) => {
      try {
        const EMPLOYEE_DETAILS_RATINGS = 'updated-rating';
        const response = await axios.get(`${API_BASE_URL}/${EMPLOYEE_DETAILS_RATINGS}/${userid}/${value}`);
        if (response.ok) {
          setSubmitted(true);
        } 
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    };

  // Initialize all input fields with 0 instead of empty string
  const [inputs, setInputs] = useState({
    totalEarnings: 0,
    hraPaid: 0,
    section80C: 0,
    pf: 0,
    vpf: 0,
    others80C: 0,
    housingLoan: 0,
    chapterVIOthers: 0,
    section80D: 0,
    section80DD: 0,
    section80U: 0,
    section80DDB: 0,
    section80EEA: 0,
    section80EEB: 0,
    section80E: 0,
    section80CCD1B: 0,
    employernps80ccd1b: 0,
    otherIncome: 0,
    fbp: []
  });

  const [results, setResults] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [employee, setEmployeeResults] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [openBreakup, setOpenBreakup] = useState(false);
  const [selectedRegime, setSelectedRegime] = useState(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [showSlabs, setShowSlabs] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hovered, setHovered] = useState(0); // <-- This is the one you're asking about
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    console.log('Particles state:', particles);
    // Only add event listener in browser environment
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [particles]);

  // Fetch employee details on component mount
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}${EMPLOYEE_DETAILS_ENDPOINT}/${userid}`);
          if (response.data.success) {
            const employeeData = response.data.data;
           setEmployeeResults(response.data.data);
            // Update the input fields with API response data
            setInputs(prev => ({
              ...prev,
              totalEarnings: employeeData?.totalEarnings || 0,
              pf: employeeData?.pf || 0,
              vpf: employeeData?.vpf || 0,
              employernps80ccd1b: employeeData?.npsMaxLimit || 0,
              fbp: employeeData?.fbp || []
            }));
          }
        
      } catch (error) {
        console.error('Error fetching employee details:', error);
        setError('Failed to fetch employee details. Using default values.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, []);

  const inputFields = [
    { label: 'Total Earnings', name: 'totalEarnings',fieldLable:'Total Earnings' },
    { label: 'Rent Paid', name: 'hraPaid',fieldLable:'Rent Paid Annualy'},
    { label: '80 C', name: 'section80C' },
    { label: 'Housing Loan', name: 'housingLoan' },
    { label: 'Other Chapter VI A', name: 'chapterVIOthers' },
    { label: 'Other Sources Income', name: 'otherIncome' },
    inputs.fbp.length > 0 && { label: "FBP", name: 'fbp'}
  ];

  // New color theme
  const colors = {
    primary: '#1976D2',
    secondary: '#0D47A1',
    accent: '#42A5F5',
    background: '#F5F9FF',
    highlight: '#E3F2FD',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFA726',
    text: '#263238',
    lightText: '#607D8B',
    oldRegime: '#1976D2',
    newRegime: '#00ACC1',
    border: '#CFD8DC',
    white: '#FFFFFF',
    darkBlue: '#0D47A1'
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
      Number(inputs.section80CCD1B || 0) +
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
    if (inputs.totalEarnings > 0) {
      if (autoCalculate && Object.values(inputs).some(val => val !== 0)) {
        const timer = setTimeout(() => {
          calculateTax();
        }, 1000); // Debounce for 1 second

        return () => clearTimeout(timer);
      }
    }
  }, [inputs, autoCalculate]);

  // Create fireworks particles
  const createFireworks = () => {
    const particleCount = 50;
    const newParticles = Array(particleCount).fill().map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      size: `${Math.random() * 6 + 3}px`,
      animationDuration: `${Math.random() * 1 + 1}s`,
      delay: `${Math.random() * 0.5}s`
    }));
  
    setParticles(newParticles);
    setShowFireworks(true);
    
    setTimeout(() => {
      setShowFireworks(false);
    }, 1500);
  };

  const handleContinue = () => {
    setShowWelcome(false);
  };

  const handleButtonClick = () => {
    if (employee?.isFySwitch !== 1) {
      setShowAlert(true);
      return;
    }
    handleContinue();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (values, name) => {
    const value = values.floatValue || 0;
    
    let limitedValue = value;
    switch(name) {
      case 'housingLoan':
        limitedValue = Math.min(value, 200000);
        break;
      case 'section80D':
        limitedValue = Math.min(value, 75000);
        break;
      case 'section80DD':
      case 'section80U':
        limitedValue = Math.min(value, 125000);
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
      totalEarnings: 0,
      hraPaid: 0,
      section80C: 0,
      pf: 0,
      vpf: 0,
      others80C: 0,
      housingLoan: 0,
      chapterVIOthers: 0,
      section80D: 0,
      section80DD: 0,
      section80U: 0,
      section80DDB: 0,
      section80EEA: 0,
      section80EEB: 0,
      section80E: 0,
      section80CCD1B: 0,
      employernps80ccd1b: 0,
      otherIncome: 0,
      fbp: []
    });
    setResults(null);
    setError(null);
    setAutoCalculate(false);
    setShowConfetti(false);
  };

  const calculateTax = async () => {
    setLoading(true);
    setError(null);
    setShowConfetti(false);
    
    try {
      // Calculate total FBP amount from the array of FBP items
      const totalFBP = inputs.fbp.reduce((sum, item) => {
        const amount = item.amount || 0;
        const maxLimit = item.maxLimit || Infinity; // Use Infinity if no maxLimit is specified
        const limitedAmount = Math.min(amount, maxLimit);
        return Math.round(sum + limitedAmount);
      }, 0);

      const adjustedFBPDetails = inputs.fbp.map(item => ({
        ...item,
        adjustedAmount: Math.min(item.amount || 0, item.maxLimit || Infinity),
      }));

      const payload = {
        financialYear: '2025-2026',
        incomeDetails: {
          totalEarnings: inputs.totalEarnings || 0,
          hraPaid: inputs.hraPaid || 0,
          section80C: inputs.section80C || 0,
          housingLoan: inputs.housingLoan || 0,
          chapterVIOthers: inputs.chapterVIOthers || 0,
          otherIncome: inputs.otherIncome || 0,
          employernps80ccd1b: inputs.employernps80ccd1b || 0,
          fbp: totalFBP || 0,
          userids: userid || 0,
          npsMaxLimitOld:employee.npsMaxLimitOld,
          npsMaxLimitNew:employee.npsMaxLimitNew,
          fbpDetails: adjustedFBPDetails // Include the full FBP array in the payload
        }
      };

      // Start timer for minimum 2 seconds loading
      const startTime = Date.now();
      
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Calculate remaining time to reach 2 seconds
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(1000 - elapsed, 0);
      
      // Wait for remaining time if API call was faster than 2 seconds
      await new Promise(resolve => setTimeout(resolve, remaining));

      if (response?.data?.success) {
        setResults(response.data.data);
      } else {
        throw new Error(response?.data?.message || 'Invalid response from server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to calculate tax');
      console.error('Tax calculation error:', err);
    } finally {
      setLoading(false);
      setAutoCalculate(true);
    }
  };

  const handleOpenBreakup = (regime) => {
    if (!regime) return;
    setShowConfetti(false);
    setSelectedRegime(regime);
    setOpenBreakup(true);
    setShowSlabs(false);
  };
  const handleCloseBreakup = () => {
    setOpenBreakup(false);
    setShowConfetti(false);
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

  const handleFBPChange = (index, value) => {
    const updatedFBP = [...inputs.fbp];
    updatedFBP[index] = {
      ...updatedFBP[index],
      amount: value.floatValue || 0
    };
    setInputs(prev => ({
      ...prev,
      fbp: updatedFBP
    }));
  };
  const renderInputField = () => {
    const currentField = inputFields[activeTab];
    if (!currentField || !currentField.name) return null;

    const fieldValue = inputs[currentField.name] || 0;

    switch(activeTab) {
      case 0: // Total Earnings
      return (
        <NumericFormat
          customInput={TextField}
          fullWidth
          label={`${currentField.fieldLable} (₹)`}
          variant="outlined"
          name={currentField.name}
          onValueChange={(values) => handleInputChange(values, currentField.name)}
          value={fieldValue}
          decimalScale={0}
          disabled
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
      case 1://HRA
        return (
        <NumericFormat
          customInput={TextField}
          fullWidth
          label={`${currentField.fieldLable} (₹)`}
          variant="outlined"
          name={currentField.name}
          onValueChange={(values) => handleInputChange(values, currentField.name)}
          value={fieldValue}
          decimalScale={0}
          disabled={employee?.id === 65}
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
      case 5: // Other Sources Income
        return (
          <NumericFormat
            customInput={TextField}
            fullWidth
            label={`${currentField.label} (₹)`}
            variant="outlined"
            name={currentField.name}
            value={fieldValue}
            decimalScale={0}
            onValueChange={(values) => handleInputChange(values, currentField.name)}
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
        case 6: // FBP Tab
        return (
          <Box>
            <Typography variant="body1" color={colors.primary} fontWeight="600" mb={2}>
              Flexible Benefit Plan (FBP) Components
            </Typography>
            {inputs.fbp.length > 0 ? (
              <Box>
                <Grid container spacing={3} alignItems="stretch">
                  {inputs.fbp.map((item, index) => (
                    <Grid item xs={12} sm={6} key={item.payHeadID}>
                      <Box 
                        height="100%"
                        display="flex"
                        flexDirection="column"
                      >
                        <Box flexGrow={1}>
                          <NumericFormat
                            customInput={TextField}
                            fullWidth
                            label={`${item.payHeadName} (₹)`}
                            variant="outlined"
                            value={item.amount || 0}
                            onValueChange={(values) => handleFBPChange(index, values)}
                            thousandSeparator={true}
                            decimalScale={0}
                            helperText={
                              <>
                                <span>Max: ₹{item.maxLimit.toLocaleString('en-IN')}</span>
                                <span> | Allowed Regimes: {item.allowedTaxRegime === 3 || item.allowedTaxRegime === 0 ? 'Both' : item.allowedTaxRegime === 1 ? 'Old Regime' : 'New Regime'}</span>
                                {item.criteriaOption !== "" && (
                                  <>
                                    <br />
                                    <span>Choice Based: {item.criteriaOption}</span>
                                  </>
                                )}
                              </>
                            }
                            InputLabelProps={{ 
                              shrink: true,
                              style: {
                              }
                            }}
                            InputProps={{
                              style: {
                              },
                              endAdornment: (
                                <Chip 
                                  label="Max" 
                                  size="small" 
                                  onClick={() => handleFBPChange(index, { floatValue: item.maxLimit })}
                                  sx={{ cursor: 'pointer' }}
                                />
                              )
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={3} p={2} bgcolor={colors.highlight} borderRadius="12px">
                  <Typography variant="body1" fontWeight="600">
                    Total FBP Amount: ₹ {inputs.fbp.reduce((sum, item) => {
                      const amount = item.amount || 0;
                      const maxLimit = item.maxLimit || Infinity;
                      return Math.round(sum + Math.min(amount, maxLimit));
                    }, 0).toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color={colors.lightText}>
                No FBP components available for this employee.
              </Typography>
            )}
          </Box>
        );
      case 2: // 80C Tab
        return (
          <Box>
            <Box mb={2}>
              <Typography variant="body1" color={colors.primary} fontWeight="600" mb={1}>
                Max Eligibility: ₹1,50,000
              </Typography>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={3}>
              <NumericFormat
                customInput={TextField}
                label="PF (₹)"
                variant="outlined"
                name="pf"
                value={inputs.pf || 0}
                thousandSeparator={true}
                decimalScale={0}
                fullWidth
                disabled
              />
              <NumericFormat
                customInput={TextField}
                label="VPF (₹)"
                variant="outlined"
                name="vpf"
                value={inputs.vpf || 0}
                decimalScale={0}
                onValueChange={(values) => handleInputChange(values, 'vpf')}
                thousandSeparator={true}
                fullWidth
              />
              <NumericFormat
                customInput={TextField}
                label="Others (₹)"
                variant="outlined"
                name="others80C"
                value={inputs.others80C || 0}
                decimalScale={0}
                onValueChange={(values) => handleInputChange(values, 'others80C')}
                thousandSeparator={true}
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 150000 }, 'others80C')}
                      sx={{ cursor: 'pointer' }}
                    />
                  )
                }}
                fullWidth
              />
            </Box>
            <Box p={2} bgcolor={colors.highlight} borderRadius="12px">
              <Typography variant="body1" fontWeight="600">
                Total 80C: ₹{(inputs.section80C || 0).toLocaleString('en-IN')} / ₹1,50,000
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
              value={inputs.housingLoan || 0}
              decimalScale={0}
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
                value={inputs.section80D || 0}
                decimalScale={0}
                onValueChange={(values) => handleInputChange(values, 'section80D')}
                thousandSeparator={true}
                helperText="Max: ₹75,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 75000 }, 'section80D')}
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
                value={inputs.section80DD || 0}
                decimalScale={0}
                onValueChange={(values) => handleInputChange(values, 'section80DD')}
                thousandSeparator={true}
                helperText="Max: ₹1,25,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 125000 }, 'section80DD')}
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
                value={inputs.section80U || 0}
                onValueChange={(values) => handleInputChange(values, 'section80U')}
                thousandSeparator={true}
                decimalScale={0}
                helperText="Max: ₹1,25,000"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Chip 
                      label="Max" 
                      size="small" 
                      onClick={() => handleInputChange({ floatValue: 125000 }, 'section80U')}
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
                value={inputs.section80DDB || 0}
                onValueChange={(values) => handleInputChange(values, 'section80DDB')}
                thousandSeparator={true}
                decimalScale={0}
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
                value={inputs.section80EEA || 0}
                decimalScale={0}
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
                value={inputs.section80EEB || 0}
                onValueChange={(values) => handleInputChange(values, 'section80EEB')}
                thousandSeparator={true}
                decimalScale={0}
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
                value={inputs.section80E || 0}
                decimalScale={0}
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
                value={inputs.section80CCD1B || 0}
                decimalScale={0}
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
                value={inputs.employernps80ccd1b || 0}
                decimalScale={0}
                onValueChange={(values) => handleInputChange(values, 'employernps80ccd1b')}
                thousandSeparator={true}
                helperText={
                  `NPS Max Limit For Old Tax Regime 10% & 14% For New Tax Regime On Basic & DA` +
                  (employee?.npsMaxLimitOld > 0 ? ` | OLD: ₹${employee.npsMaxLimitOld}` : '') +
                  (employee?.npsMaxLimitNew > 0 ? ` | NEW: ₹${employee.npsMaxLimitNew}` : '')
                } fullWidth
              />
            </Box>
            
            <Box p={2} bgcolor={colors.highlight} borderRadius="12px">
              <Typography variant="body1" fontWeight="600">
                Total Chapter VI A Deductions: ₹{(inputs.chapterVIOthers || 0).toLocaleString('en-IN')}
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
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Welcome Section */}
    {showWelcome && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
        style={{ 
          width: '100%', 
          marginBottom: '10px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <WelcomeCard>
          <Box position="relative" zIndex={1}>
          <Typography
  variant="h5"
  gutterBottom
  sx={{
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  }}
>
  <CelebrationIcon sx={{ mr: 1, animation: `${floatAnimation} 3s ease-in-out infinite` }} />
  
  
  {employee?.employeeName ? (
  <>
    Welcome,&nbsp;
    {employee.employeeName}
    {employee.employeeNumber && ` (${employee.employeeNumber})`}
  </>
) : employee?.isFySwitch !== 1 ? (
   <Typography variant="body1" sx={{ mb: 1.5, fontSize: '1.5rem', color: colors.warning }}>
   Payroll Cut Off Date is Crossed, Please Check Next Month. 
  </Typography>
) : (
  <Typography variant="body1" sx={{ mb: 2, fontSize: '2rem', color: colors.warning }}>
    Loading Please Wait...&nbsp;
  </Typography>
)}
  
</Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '0.9rem' }}>
              Here's your personalized tax planning dashboard for FY 2025-26
            </Typography>
          </Box>
          
          <Box sx={{ 
  backgroundColor: 'rgba(255,255,255,0.15)', 
  p: 2, 
  borderRadius: '12px',
  backdropFilter: 'blur(5px)'
}}>
  <Grid container spacing={3}>
        {/* Left Side - Key Pointers */}
  <Grid item xs={12} md={5}>
  <Box component="ul" sx={{ pl: 2, '& li': { mb: 1, fontSize: '0.9rem' } }}>
  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Key Pointers to your income tax computation</Typography>
  
    <li><strong>Default Regime - :</strong> New Regime would be auto-selected with revised Slabs</li>
    <li><strong>Standard Deduction:</strong> ₹75,000 (↑ from ₹50K) in New Regime</li>
    <li><strong>Rebate u/s 87A:</strong> ₹60K for income ≤ ₹12L (New Regime)</li>
    <li><strong>Surcharge:</strong> Reduced to 25% (from 37%) for income > ₹5Cr</li>
    <li><strong>Leave Encashment:</strong> ₹25L exemption for both regimes (↑ from ₹3L)</li>
  </Box>
  </Grid>
  <Grid item xs={12} md={7}>
  <Box sx={{ mt: 2 }}>
    <Typography variant="h6" gutterBottom fontWeight="bold">
      Income Tax Slabs Comparison (Old vs New Regime)
    </Typography>
    <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
      <Table size="small" aria-label="tax slab comparison table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Income Range</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc', fontWeight: 'bold' }}>Old Regime</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>New Regime</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>Up to ₹2,50,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>0%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>0%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹2,50,001 – ₹4,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>5%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>0%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹4,00,001 – ₹5,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>5%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>5%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹5,00,001 – ₹8,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>20%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>5%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹8,00,001 – ₹10,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>20%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>10%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹10,00,001 – ₹12,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>10%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹12,00,001 – ₹16,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>15%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹16,00,001 – ₹20,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>20%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>₹20,00,001 – ₹24,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>25%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>Above ₹24,00,000</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc' }}>30%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Grid>
    </Grid>
    { employee?.employeeName ? (
        <>
  <Button 
    variant="contained" 
   onClick={handleButtonClick}
    sx={{ 
      mt: 2,
      backgroundColor: colors.warning, 
      '&:hover': { backgroundColor: '#388e3c' },
      fontWeight: '600', mr: 1, animation: `${floatAnimation} 2s ease-in-out infinite`
    }}>
      Continue to Tax Comparison
  </Button>
        </>
      ) : (
        <ClipLoader color={colors.warning} loading={true} size={50} />
      )}



  <Snackbar 
        open={showAlert} 
        autoHideDuration={10000} 
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setShowAlert(false)} sx={{ 
      mt: 2,
      backgroundColor: colors.warning, 
      '&:hover': { backgroundColor: '#388e3c' },
      fontWeight: '600', mr: 1, animation: `${floatAnimation} 2s ease-in-out infinite`
    }}>   { employee?.isFySwitch !==1? employee?.message:"Payroll Cut Off Date is Crossed, Please Check Next Month ."}
        </Alert>
      </Snackbar>
</Box>
        </WelcomeCard>
      </motion.div>
    )}
     {!showWelcome && (
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
         gap: '24px',
         position: 'relative',
         overflow: 'hidden'
       }}
     >
      {/* Confetti effect */}
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          colors={['#1976D2', '#0D47A1', '#42A5F5', '#4CAF50', '#FFA726','#42A5F5','#800000','#9932cc','#ff4500']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}


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
            <Box position="relative" zIndex={1}>
      <Typography 
      sx={{ mb: 0, fontSize: '1.1rem', color:colors.primary}}>
        <CelebrationIcon sx={{ mr: 1, animation: `${floatAnimation} 3s ease-in-out infinite` }} />
        Welcome,  {employee?.employeeName} ({employee?.employeeNumber})
        </Typography>
       <Typography 
       sx={{ mb: -1, fontSize: '0.8rem' , color:colors.warning,marginLeft:'30px'}}>
        Here's your personalized tax planning dashboard for FY 2025-26
      </Typography>
      </Box>
              <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                style={{
                  color: colors.primary,
                  textTransform: 'none',
                  fontWeight: '500'
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
                  label={field?.label || ''} 
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
                      <span style={{ color: colors.text, fontWeight: '500' }}>{field?.label || ''}:</span> 
                      <span style={{ 
                        color: inputs[field?.name] ? colors.primary : colors.lightText,
                        fontWeight: '600'
                      }}>
                        {field.name === 'fbp' ? 
                          `₹${inputs.fbp.reduce((sum, item) => {
                            const amount = item.amount || 0;
                            const maxLimit = item.maxLimit || Infinity; // Use the item's maxLimit if available
                            return sum + Math.min(amount, maxLimit);
                          }, 0).toLocaleString('en-IN')
                        }` :
                          (inputs[field?.name] ? `₹${Number(inputs[field.name]).toLocaleString('en-IN')}` : '')
                        }
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
                style={{ color: '#FFFFFF', marginRight: '8px' }}
              >
                {loading ? (
                  <>
                  

                    <CircularProgress 
                      size={24} 
                      style={{ 
                        color: '#FFFFFF',
                        marginRight: '8px' 
                      }} 
                    />
                    Calculating...
                  </>
                ) : 'Calculate Tax'}
              </PrimaryButton>
              </Box>
              <Box mt={4} display="flex" justifyContent="center" gap={2}>
              <Typography variant="body2" style={{ 
                      display: 'flex',
                      color:colors.error,
                      justifyContent: 'space-between',
                      fontsize: '1px',
                      alignItems: 'center'
                    }}>
                        Disclaimer :
                        The Tax Calculator feature provided in this application is for informational and comparison purposes only. The calculations generated are based on general tax rules and assumptions and may not reflect the actual tax liability applicable to your specific financial situation.
                        This tool provides a rough estimate and should not be considered as a final tax computation or a substitute for professional tax advice. Users are advised to consult with a qualified tax professional or refer to official tax regulations to determine their exact tax obligations.
                        The application and its providers do not guarantee the accuracy, completeness, or applicability of the results and are not responsible for any discrepancies, errors, or financial decisions made based on this tool.
                        </Typography>
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
 <Tooltip title="Exit" placement="top">
    <ExitButton
      onClick={handleExit}
       align="top"
      disabled={loading}
      sx={{ 
        mt: 2,
        backgroundColor: colors.error, 
        '&:hover': { backgroundColor: colors.error },
        fontWeight: '600', mr: 1
      }}
      aria-label="Exit"
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <ExitToAppIcon  />
      )}
    </ExitButton>
  </Tooltip>
        <StyledPaper elevation={0}>
          <Box p={isMobile ? 2 : 3}>
            {loading ? (
              <Box 
                display="flex" 
                flexDirection="column"
                alignItems="center" 
                justifyContent="center" 
                height="100px"
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
                <Box mb={4}>
                  <Box mb={3}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Box 
                        p={3}
                        sx={{
                          background: results.suggestion === 'OLD' 
                          ? 'linear-gradient(135deg, #02569B 0%, #13B9FD 100%)'  // Green success gradient
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
                          color: colors.secondary, 
                          fontSize: 30,
                        }}  />
                      )}
                        <Typography style={{ 
                          fontWeight: '600',
                          color: results.suggestion === 'OLD'?colors.white:colors.darkBlue
                        }}>
                          Old Regime
                        </Typography>
                        <Typography variant="h4" style={{ 
                          margin: '12px 0',
                          fontWeight: '700',
                          color: results.suggestion === 'OLD'?colors.white:colors.darkBlue
                        }}>
                          ₹{results?.oldRegime?.totalTaxWithCess?.toLocaleString('en-IN') || 0}
                        </Typography>
                        <SecondaryButton 
                          size="small"
                          onClick={() => handleOpenBreakup(results.oldRegime)}
                          style={{
                            marginTop: '1px',
                            minWidth: '120px',
                            borderColor: colors.accent,
                            background:colors.border,
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
                          ? 'linear-gradient(135deg, #02569B 0%, #13B9FD 100%)'  // Green success gradient
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
                          color: colors.secondary, 
                          fontSize: 30,
                        }}  />
                      )}
                        <Typography style={{ 
                          fontWeight: '600',
                          color: results.suggestion === 'NEW'?colors.white:colors.darkBlue
                        }}>
                          New Regime
                        </Typography>
                        <Typography variant="h4" style={{ 
                          margin: '12px 0',
                          fontWeight: '700',
                          color: results.suggestion === 'NEW'?colors.white:colors.darkBlue
                        }}>
                          ₹{results?.newRegime?.totalTaxWithCess?.toLocaleString('en-IN') || 0}
                        </Typography>
                        <SecondaryButton 
                          size="small"
                          onClick={() => handleOpenBreakup(results.newRegime)}
                          style={{
                            marginTop: '1px',
                            minWidth: '100px',
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
                      p={2} 
                      bgcolor={colors.highlight} 
                      borderRadius="12px"
                      textAlign="center"
                    >
                      <Typography variant="h6" style={{ 
                        color: colors.primary,
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}>
                      <CelebrationIcon sx={{ mr: 1, animation: `${floatAnimation} 3s ease-in-out infinite` }} />
                       You save   <span style={{ 
                          color: results.suggestion === 'OLD' ? colors.darkBlue : colors.darkBlue,
                          fontWeight: '700',
                          fontSize:'25px',
                          textTransform: 'capitalize'
                        }}>₹{results?.savings?.toLocaleString('en-IN') || 0}</span>
                      </Typography>
                      <Typography style={{ fontWeight: '500' }}>
                        <strong>Recommendation:</strong> The{' '}
                        <span style={{ 
                          color: results.suggestion === 'OLD' ? colors.oldRegime : colors.newRegime,
                          fontWeight: '600',
                          fontSize:'20px',
                          textTransform: 'capitalize'
                        }}>
                          {results.suggestion?.toLowerCase() || ''}
                          {' '}
                          Tax Regime
                        </span>{' '}
                         Is Beneficial For You
                      </Typography>
                    </Box>
                    <div style={{float:'right'}} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-2xl shadow-xl text-center space-y-4">
                    <h5 className="text-2xl font-bold text-gray-400">How was your experience?</h5>
                    <div className="flex justify-center space-x-2 mt-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onMouseEnter={() => setHovered(num)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => handleRating(num)}
                            className={`text-3xl transition-transform transform hover:scale-125 ${
                              (hovered >= num || rating >= num) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>

                      {submitted && (
                        <div style={{float:'center'}} className="mt-4 text-green-600 font-medium transition-opacity animate-fade-in">
                          <h5>Thank you for your {rating}-star rating! 🌟</h5>
                        </div>
                      )}

                    </div>
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
      {selectedRegime && (
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
          <div ref={printRef} style={{ padding: '16px', backgroundColor: 'white' }}>
            <DialogTitle sx={{ 
              backgroundColor: selectedRegime === results?.oldRegime ? colors.oldRegime : colors.newRegime,
              color: 'white',
              padding: '16px 24px'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: '600' }}>
                  Detailed Tax Breakup - {selectedRegime === results?.oldRegime ? 'Old Regime' : 'New Regime'}
                <br/>
                <span>
                {employee?.employeeName} ({employee?.employeeNumber})
                </span>
                </Typography>
                <IconButton 
                  onClick={handleCloseBreakup}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box display="flex" justifyContent="flex-end" mb={2}>
        </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ padding: 0 }}>
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
                            ₹{selectedRegime?.grossIncome?.toLocaleString('en-IN') || 0}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) FBP Reimbursement</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                          ₹{selectedRegime?.fbp?.toLocaleString('en-IN') || 0}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>(-) Exemptions</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime === results?.newRegime ? '0' : selectedRegime?.hra?.toLocaleString('en-IN') || 0}
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
                            ₹{selectedRegime?.pt?.toLocaleString('en-IN') || 0}
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
                            ₹{selectedRegime === results?.newRegime ? (inputs.otherIncome || 0).toLocaleString('en-IN') :(inputs.otherIncome || 0).toLocaleString('en-IN')}
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
                          ₹{selectedRegime?.chpaterVIOther?.toLocaleString('en-IN') || 0}
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
                            ₹{selectedRegime?.taxableIncome?.toLocaleString('en-IN') || 0}
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
                            ₹{selectedRegime?.rebate?.toLocaleString('en-IN') || 0}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Surcharge</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime?.surchargeIncome?.toLocaleString('en-IN') || 0}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Tax + Surcharge</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime?.taxIncludingSurchargeIncome?.toLocaleString('en-IN') || 0}
                          </TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell sx={{ fontWeight: '500' }}>Education Cess</TableCell>
                          <TableCell align="right" sx={{ fontWeight: '600' }}>
                            ₹{selectedRegime?.cess?.toLocaleString('en-IN') || 0}
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
                            ₹{selectedRegime?.totalTaxWithCess?.toLocaleString('en-IN') || 0}
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
                            ₹{Math.round((selectedRegime?.totalTaxWithCess || 0)/12).toLocaleString('en-IN')}
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
                  
                  {showSlabs && selectedRegime?.taxSlabs && (
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
                                <TableCell>{slab?.range || ''}</TableCell>
                                <TableCell align="right">{slab?.tax || ''}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <div align="left" style={{color:colors.error}}> {dateInIST}</div>
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
            </div>
            {results && (
  <Tooltip title="Download PDF" placement="left">
    <FloatingDownloadButton
      onClick={handleDownloadPdf}
      disabled={loading}
      aria-label="Download PDF"
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <DownloadIcon />
      )}
    </FloatingDownloadButton>
  </Tooltip>
)}
          </motion.div>
        </Dialog>
      )}
      </motion.div>
      )}
    </motion.div>
  );
};


export default IncomeTaxCalculator;