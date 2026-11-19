const STORAGE_KEY = "employee-registration-records";
const form = document.querySelector("#employee-form");
const employeeList = document.querySelector("#employee-list");
const emptyState = document.querySelector("#empty-state");
const employeeCount = document.querySelector("#employee-count");
const formMessage = document.querySelector("#form-message");

function loadEmployees() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let employees = loadEmployees();

function saveEmployees() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    return true;
  } catch {
    formMessage.textContent = "Could not save employee data in this browser. Check your storage settings.";
    return false;
  }
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value || "—";
  row.append(cell);
  return cell;
}

function renderEmployees() {
  employeeList.replaceChildren();
  emptyState.hidden = employees.length > 0;
  employeeCount.textContent = `${employees.length} ${employees.length === 1 ? "employee" : "employees"}`;

  for (const employee of employees) {
    const row = document.createElement("tr");
    addCell(row, employee.fullName);
    addCell(row, employee.email);
    addCell(row, employee.department);
    addCell(row, employee.jobTitle);
    addCell(row, employee.startDate);

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${employee.fullName}`);
    removeButton.addEventListener("click", () => {
      employees = employees.filter((item) => item.id !== employee.id);
      if (saveEmployees()) renderEmployees();
    });
    actionCell.append(removeButton);
    row.append(actionCell);
    employeeList.append(row);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const email = String(data.get("email")).trim().toLowerCase();
  if (employees.some((employee) => employee.email.toLowerCase() === email)) {
    formMessage.textContent = "An employee with this email address is already registered.";
    form.elements.email.focus();
    return;
  }

  employees.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    fullName: String(data.get("fullName")).trim(),
    email,
    department: String(data.get("department")),
    jobTitle: String(data.get("jobTitle")).trim(),
    startDate: String(data.get("startDate")),
    phone: String(data.get("phone")).trim(),
  });

  if (saveEmployees()) {
    renderEmployees();
    form.reset();
    formMessage.textContent = "Employee registered successfully.";
  }
});

form.addEventListener("reset", () => {
  formMessage.textContent = "";
});

renderEmployees();
