import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import React, { useState, useMemo } from "react";

export default function CalvinsMortgageCalculator() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [homePrice, setHomePrice] = useState(325000);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(5.0);
  const [termYears, setTermYears] = useState(25);
  const [propertyTax, setPropertyTax] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [lawyerFees, setLawyerFees] = useState(0);
  const [inspectionFees, setInspectionFees] = useState(0);
  const [appraisalFees, setAppraisalFees] = useState(0);
  const [titleInsuranceFees, setTitleInsuranceFees] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  // Calculate mortgage principal
  const principal = homePrice - downPayment;

  // Monthly mortgage payment calculation
  const monthlyPayment = useMemo(() => {
    const P = Number(principal) || 0;
    const r = Number(interestRate) / 100 / 12;
    const n = Number(termYears) * 12;
    if (P <= 0 || r <= 0 || n <= 0) return 0;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  }, [principal, interestRate, termYears]);

  // Calculate Manitoba Land Transfer Tax
  const landTransferTax = useMemo(() => {
    const price = Number(homePrice);
    if (price <= 0) return 0;
    let tax = 0;
    if (price <= 50000) tax = price * 0.005;
    else if (price <= 100000) tax = 50 + (price - 50000) * 0.01;
    else if (price <= 150000) tax = 550 + (price - 100000) * 0.015;
    else if (price <= 200000) tax = 1300 + (price - 150000) * 0.02;
    else tax = 2300 + (price - 200000) * 0.025;
    return tax;
  }, [homePrice]);

  function currencyCAD(n) {
    return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      homePrice,
      downPayment,
      interestRate,
      termYears,
      monthlyPayment: monthlyPayment.toFixed(2),
      propertyTax,
      insurance,
      lawyerFees,
      inspectionFees,
      appraisalFees,
      titleInsuranceFees,
      landTransferTax,
      notes,
      submittedAt: new Date().toISOString(),
    };

    const to = ""; // put your email here if using mailto
    const subject = encodeURIComponent("Mortgage lead: " + firstName + " " + lastName);
    const bodyLines = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Home Price: ${currencyCAD(homePrice)}`,
      `Down Payment: ${currencyCAD(downPayment)}`,
      `Interest Rate: ${interestRate}%`,
      `Term (years): ${termYears}`,
      `Estimated Monthly Payment: ${currencyCAD(monthlyPayment.toFixed(2))}`,
      `Property Tax: ${currencyCAD(propertyTax)}`,
      `Insurance: ${currencyCAD(insurance)}`,
      `Lawyer Fees: ${currencyCAD(lawyerFees)}`,
      `Inspection Fees: ${currencyCAD(inspectionFees)}`,
      `Appraisal Fees: ${currencyCAD(appraisalFees)}`,
      `Title Insurance Fees: ${currencyCAD(titleInsuranceFees)}`,
      `Manitoba Land Transfer Tax: ${currencyCAD(landTransferTax)}`,
      "---",
      `Notes: ${notes}`,
      `Submitted at: ${new Date().toLocaleString()}`,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-3">Canadian Mortgage Calculator</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter your info and get an estimate including Manitoba Land Transfer Tax and extra fees.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="p-3 border rounded-lg"
          />
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="p-3 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 border rounded-lg"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="p-3 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Home Price</span>
            <input
              type="number"
              min="0"
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Down Payment</span>
            <input
              type="number"
              min="0"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Interest Rate (%)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Term (years)</span>
            <input
              type="number"
              min="1"
              value={termYears}
              onChange={(e) => setTermYears(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Property Tax (CAD)</span>
            <input
              type="number"
              min="0"
              value={propertyTax}
              onChange={(e) => setPropertyTax(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-xs text-gray-600">Home Insurance (CAD)</span>
            <input
              type="number"
              min="0"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={lawyerFees}
            onChange={(e) => setLawyerFees(e.target.value)}
            placeholder="Lawyer Fees"
            className="p-3 border rounded-lg"
          />
          <input
            type="number"
            min="0"
            value={inspectionFees}
            onChange={(e) => setInspectionFees(e.target.value)}
            placeholder="Building Inspection Fees"
            className="p-3 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={appraisalFees}
            onChange={(e) => setAppraisalFees(e.target.value)}
            placeholder="Appraisal Fees"
            className="p-3 border rounded-lg"
          />
          <input
            type="number"
            min="0"
            value={titleInsuranceFees}
            onChange={(e) => setTitleInsuranceFees(e.target.value)}
            placeholder="Title Insurance Fees"
            className="p-3 border rounded-lg"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-baseline 