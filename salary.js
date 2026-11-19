const form = document.querySelector("#salary-form");
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function calculateSalary() {
  const annualSalary = Number(document.querySelector("#salary").value);
  const periods = Number(document.querySelector("#periods").value);
  const taxRate = Number(document.querySelector("#tax-rate").value);
  const otherDeductions = Number(document.querySelector("#other-deductions").value);

  if (!form.reportValidity()) return;

  const gross = periods > 0 ? annualSalary / periods : 0;
  const tax = gross * taxRate / 100;
  const net = Math.max(0, gross - tax - otherDeductions);

  document.querySelector("#gross").textContent = currency.format(gross);
  document.querySelector("#tax").textContent = currency.format(tax);
  document.querySelector("#deductions").textContent = currency.format(otherDeductions);
  document.querySelector("#net").textContent = currency.format(net);
}

form.addEventListener("submit", (event) => {
  event.prevent
  event.preventDefault();
  calculateSalary();
});

calculateSalary();
