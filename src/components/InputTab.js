import React from 'react';
import { TextField } from '@mui/material';

const InputTab = ({ activeTab, inputs, onInputChange }) => {
  const inputFields = [
    { name: 'totalEarnings', label: 'Total Earnings For The Year (₹)', type: 'number' },
    { name: 'hraPaid', label: 'HRA Paid for the Year (₹)', type: 'number' },
    { name: 'section80C', label: '80C Deductions For The Year (₹)', type: 'number' },
    { name: 'housingLoan', label: 'Housing Loan Interest For The Year (₹)', type: 'number' },
    { name: 'chapterVIOthers', label: 'Chapter VI A Others For The Year (₹)', type: 'number' },
    { name: 'otherIncome', label: 'Other Income For The Year (₹)', type: 'number' },
    { name: 'fbp', label: 'FBP For The Year (₹)', type: 'number' }
  ];

  return (
    <div>
      <TextField
        fullWidth
        label={inputFields[activeTab].label}
        variant="outlined"
        type={inputFields[activeTab].type}
        value={inputs[inputFields[activeTab].name]}
        onChange={(e) => onInputChange(inputFields[activeTab].name, e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h4>All Input Values:</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {inputFields.map((field, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>
              <strong>{field.label}:</strong> ₹{inputs[field.name].toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InputTab;