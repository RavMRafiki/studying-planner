const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const formAddSec = document.querySelector(".form-add-section");
const submitBtn = document.querySelector(".submit-btn");
const sectionName = document.getElementById("section-name");
const sectionNumber = document.getElementById("topics-number");
const sectionColor = document.getElementById("color-section");
const list = document.getElementById("accordionList");

let editElement;
let editFlag = false;
let editID = "";

const formCalculate = document.querySelector(".form-calculate");
const examDate = document.getElementById("exam-date");
const timeTo = document.querySelector(".time-to");

formAddSec.addEventListener("submit", addSection);
formCalculate.addEventListener("submit", calculate);
setupItems();

function addSection(e) {
  e.preventDefault();
  const _secname = sectionName.value;
  const _secnumber = sectionNumber.value;
  const _seccolor = sectionColor.value;
  if (_secname && _secnumber && !editFlag) {
    const id = new Date().getTime().toString();
    createListItem(id, _secname, _secnumber, _seccolor);
    addToLocalStorage(id, _secname, _secnumber, _seccolor);
    resetFormAddSec();
    list.parentElement.classList.remove("visually-hidden");
  } else if (_secname && _secnumber && editFlag) {
    const id = editID;
    editLocalStorage(editID, _secname, _secnumber, _seccolor);
    const ed = editElement.parentElement.parentElement;
    editElement.parentElement.parentElement.innerHTML = `
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#${id}"
                aria-expanded="true"
                aria-controls="${id}"
              >${_secname}</button>
            </h2>
            <div
              id="${id}"
              class="accordion-collapse collapse show"
              data-bs-parent="#accordionList"
            >
              <div class="accordion-body">
                <p>
                  This section contains
                  <span class="number-of-topics">${_secnumber}</span> topics. You chosed
                  color <span class="color-of-topics">${_seccolor}</span> for this
                  section.
                </p>
                <button class="btn btn-primary edit-btn">
                  Edit this section
                </button>
                <button class="btn btn-danger delete-btn">Delete this section</button>
              </div>
            </div>`;
    const deleteBtn = ed.querySelector(".delete-btn");
    const editBtn = ed.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    resetFormAddSec();
  }
}

function createListItem(id, _secname, _secnumber, _seccolor) {
  const element = document.createElement("div");
  element.classList.add("accordion-item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
            <h2 class="accordion-header">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#${id}"
                aria-expanded="true"
                aria-controls="${id}"
              >${_secname}</button>
            </h2>
            <div
              id="${id}"
              class="accordion-collapse collapse show"
              data-bs-parent="#accordionList"
            >
              <div class="accordion-body">
                <p>
                  This section contains
                  <span class="number-of-topics">${_secnumber}</span> topics. You chosed
                  color <span class="color-of-topics">${_seccolor}</span> for this
                  section.
                </p>
                <button class="btn btn-primary edit-btn">
                  Edit this section
                </button>
                <button class="btn btn-danger delete-btn">Delete this section</button>
              </div>
            </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}
function resetFormAddSec() {
  sectionName.value = "";
  sectionNumber.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add to Sections";
}
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    list.parentElement.classList.add("visually-hidden");
  }
  removeFromLocalStorage(id);
  resetFormAddSec();
}
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement.parentElement;

  editElement = e.currentTarget.parentElement;
  let editElement2 =
    e.currentTarget.parentElement.parentElement.previousSibling;
  sectionName.value = element.querySelector(".accordion-button").textContent;
  sectionNumber.value =
    editElement.querySelector(".number-of-topics").textContent;
  sectionColor.value =
    editElement.querySelector(".color-of-topics").textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit Section";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, name, number, color) {
  const section = { id, name, number, color };
  let items = getLocalStorage();
  items.push(section);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, name, number, color) {
  let items = getLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.name = name;
      item.number = number;
      item.color = color;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function setupItems() {
  let items = getLocalStorage();
  list.parentElement.classList.remove("visually-hidden");
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.name, item.number, item.color);
    });
  }
}
// ****** END OF LOCAL STORAGE **********
// ****** CALCULATE **********
function calculate(e) {
  e.preventDefault();
  const chartsDiv = document.querySelector(".charts");
  chartsDiv.innerHTML = `<div>
            <canvas id="all-sections-pie-chart"></canvas>
          </div>
          <div>
            <canvas id="all-sections-bar-chart"></canvas>
          </div>
          <div>
            <canvas id="all-sections-bar-chart-with-names"></canvas>
          </div>`;
  const examDateObj = new Date(examDate.value);
  const todayDateObj = new Date();
  exam = examDateObj.getTime();
  today = todayDateObj.getTime();

  const t = exam - today;
  const oneDay = 86400000;
  const oneHour = 3600000;

  let days = Math.floor(t / oneDay);
  let hours = Math.floor((t % oneDay) / oneHour);
  timeTo.textContent = `To your exam left ${days} days.`;
  if (t <= 0) {
    timeTo.textContent = `You've already passed the exam. Were you well prepared?`;
    return;
  }
  data = collectData();
  if (data === []) {
    return;
  }
  generateFirstChart(data);

  allSections = data[1].reduce((acc, cur) => {
    return acc + +cur;
  }, 0);
  const sectionsPerDay = allSections / days;
  studyingDays = [];
  studyingMonths = [];
  let dataDodanaObj = new Date(todayDateObj.setMonth(todayDateObj.getMonth()));

  while (true) {
    if (
      examDateObj.getFullYear() > dataDodanaObj.getFullYear() ||
      (examDateObj.getFullYear() === dataDodanaObj.getFullYear() &&
        examDateObj.getMonth() > dataDodanaObj.getMonth())
    ) {
      let days =
        new Date(
          dataDodanaObj.getFullYear(),
          dataDodanaObj.getMonth(),
          0
        ).getDate() -
        dataDodanaObj.getDate() +
        1;
      let month = months[dataDodanaObj.getMonth()];
      studyingDays.push(days);
      studyingMonths.push(month);

      dataDodanaObj = new Date(
        todayDateObj.setMonth(todayDateObj.getMonth() + 1)
      );
      dataDodanaObj.setDate(1);
    } else if (
      examDateObj.getFullYear() === dataDodanaObj.getFullYear() &&
      examDateObj.getMonth() === dataDodanaObj.getMonth()
    ) {
      let days = examDateObj.getDate() - dataDodanaObj.getDate();
      let month = months[dataDodanaObj.getMonth()];
      studyingDays.push(days);
      studyingMonths.push(month);
      break;
    } else break;
  }
  generateSecondChart([studyingDays, studyingMonths]);
  dataForThird = generateDataForThirdChart(
    data,
    studyingDays,
    studyingMonths,
    sectionsPerDay
  );
  generateThirdChart([dataForThird, studyingMonths]);
}

function collectData() {
  data = getLocalStorage();
  names = data.map((section) => {
    return section.name;
  });
  numbers = data.map((section) => {
    return section.number;
  });
  colors = data.map((section) => {
    return section.color;
  });
  return [names, numbers, colors];
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function generateDataForThirdChart(
  data,
  studyingDays,
  studyingMonths,
  sectionsPerDay
) {
  dataset = [];
  data[1] = data[1].map((a) => {
    return a / sectionsPerDay;
  });
  for (let i = 0; i < data[1].length; i++) {
    dayss = [];
    for (let j = 0; j < studyingDays.length; j++) {
      if (data[1][i] >= studyingDays[j]) {
        dayss.push(studyingDays[j]);
        data[1][i] = data[1][i] - studyingDays[j];
        studyingDays[j] = 0;
      } else if (data[1][i] !== 0) {
        studyingDays[j] = studyingDays[j] - data[1][i];
        dayss.push(data[1][i]);
        data[1][i] = 0;
      } else {
        dayss.push(0);
      }
    }
    dataset.push({
      label: data[0][i],
      data: dayss,
      backgroundColor: data[2][i],
    });
  }
  return dataset;
}

function generateFirstChart(data) {
  const ctx = document.getElementById("all-sections-pie-chart");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: data[0],
      datasets: [
        {
          label: "Sections",
          data: data[1],
          backgroundColor: data[2],
        },
      ],
    },
    options: {},
  });
}

function generateSecondChart(data) {
  const ctx = document.getElementById("all-sections-bar-chart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data[1],
      datasets: [
        {
          label: "Study days in month",
          data: data[0],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function generateThirdChart(data) {
  const ctx = document.getElementById("all-sections-bar-chart-with-names");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data[1],
      datasets: data[0],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}
