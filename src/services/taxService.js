export const calculateTax = async (inputs) => {
  // In a real app, this would be an API call to your backend
  // For now, we'll simulate it with a timeout and local calculation
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = calculateTaxLocally(inputs);
      resolve(result);
    }, 1000);
  });
};

const calculateTaxLocally = (inputs) => {
  const {
    totalEarnings,
    hraPaid,
    section80C,
    housingLoan,
    chapterVIOthers,
    otherIncome,
    fbp
  } = inputs;

  // Calculate gross income
  const grossIncome = totalEarnings + otherIncome + fbp;

  // Old Regime Calculation
  const hraExemption = Math.min(
    hraPaid,
    totalEarnings * 0.5, // 50% of basic for metro cities
    totalEarnings - (0.1 * totalEarnings) // Rent paid minus 10% of basic
  );

  const totalDeductionsOld = Math.min(
    section80C + housingLoan + chapterVIOthers + hraExemption,
    200000 // Max under 80C
  );

  const taxableIncomeOld = Math.max(0, grossIncome - totalDeductionsOld - 50000); // Standard deduction

  const oldRegimeTax = calculateTaxForRegime(taxableIncomeOld, 'old');
  
  // New Regime Calculation
  const standardDeductionNew = 50000;
  const taxableIncomeNew = Math.max(0, grossIncome - standardDeductionNew);
  
  const newRegimeTax = calculateTaxForRegime(taxableIncomeNew, 'new');

  // Determine which regime is better
  const suggestion = oldRegimeTax.totalTax <= newRegimeTax.totalTax ? 'old' : 'new';

  return {
    oldRegime: {
      grossIncome,
      hraExemption,
      totalDeductions: totalDeductionsOld + 50000, // Including standard deduction
      taxableIncome: taxableIncomeOld,
      taxSlabs: oldRegimeTax.slabs,
      totalTax: oldRegimeTax.totalTax
    },
    newRegime: {
      grossIncome,
      standardDeduction: standardDeductionNew,
      taxableIncome: taxableIncomeNew,
      taxSlabs: newRegimeTax.slabs,
      totalTax: newRegimeTax.totalTax
    },
    suggestion
  };
};

const calculateTaxForRegime = (income, regime) => {
  let slabs = [];
  let totalTax = 0;
  
  if (regime === 'old') {
    // Old regime slabs (FY 2023-24)
    if (income <= 250000) {
      slabs.push({ range: 'Up to ₹2,50,000', tax: 0 });
    } else {
      slabs.push({ range: 'Up to ₹2,50,000', tax: 0 });
      
      const slab1 = Math.min(income - 250000, 250000);
      if (slab1 > 0) {
        const tax1 = slab1 * 0.05;
        slabs.push({ range: '₹2,50,001 - ₹5,00,000', tax: tax1 });
        totalTax += tax1;
      }
      
      const slab2 = Math.min(income - 500000, 500000);
      if (slab2 > 0) {
        const tax2 = slab2 * 0.2;
        slabs.push({ range: '₹5,00,001 - ₹10,00,000', tax: tax2 });
        totalTax += tax2;
      }
      
      const slab3 = Math.max(income - 1000000, 0);
      if (slab3 > 0) {
        const tax3 = slab3 * 0.3;
        slabs.push({ range: 'Above ₹10,00,000', tax: tax3 });
        totalTax += tax3;
      }
    }
    
    // Add cess
    const cess = totalTax * 0.04;
    totalTax += cess;
    slabs.push({ range: 'Health & Education Cess (4%)', tax: cess });
    
  } else {
    // New regime slabs (FY 2023-24)
    if (income <= 300000) {
      slabs.push({ range: 'Up to ₹3,00,000', tax: 0 });
    } else {
      slabs.push({ range: 'Up to ₹3,00,000', tax: 0 });
      
      const slab1 = Math.min(income - 300000, 300000);
      if (slab1 > 0) {
        const tax1 = slab1 * 0.05;
        slabs.push({ range: '₹3,00,001 - ₹6,00,000', tax: tax1 });
        totalTax += tax1;
      }
      
      const slab2 = Math.min(income - 600000, 300000);
      if (slab2 > 0) {
        const tax2 = slab2 * 0.1;
        slabs.push({ range: '₹6,00,001 - ₹9,00,000', tax: tax2 });
        totalTax += tax2;
      }
      
      const slab3 = Math.min(income - 900000, 300000);
      if (slab3 > 0) {
        const tax3 = slab3 * 0.15;
        slabs.push({ range: '₹9,00,001 - ₹12,00,000', tax: tax3 });
        totalTax += tax3;
      }
      
      const slab4 = Math.min(income - 1200000, 500000);
      if (slab4 > 0) {
        const tax4 = slab4 * 0.2;
        slabs.push({ range: '₹12,00,001 - ₹15,00,000', tax: tax4 });
        totalTax += tax4;
      }
      
      const slab5 = Math.max(income - 1500000, 0);
      if (slab5 > 0) {
        const tax5 = slab5 * 0.3;
        slabs.push({ range: 'Above ₹15,00,000', tax: tax5 });
        totalTax += tax5;
      }
    }
    
    // Add cess
    const cess = totalTax * 0.04;
    totalTax += cess;
    slabs.push({ range: 'Health & Education Cess (4%)', tax: cess });
  }
  
  return { slabs, totalTax };
};