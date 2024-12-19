// variable declarations
let formField = document.getElementById("Student-enrolls");
let nameField = document.getElementById("Student-Name");
let emailField = document.getElementById("Student-email");
let webSField = document.getElementById("Student-websites");
let imgURLField = document.getElementById("Student-img-url");
let genderField = document.getElementById("Student-gender");
let skillsField = document.getElementsByName("Student-skills");
let errorText = document.getElementById("errorText");

let studentLists = JSON.parse(localStorage.getItem("studentLists")) || [];
console.log(studentLists);

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the student list from localStorage
  showStudentList();
});

//validation function to validate all fields
function validateFields() {
  let errors = [];
  errorText.innerHTML = "";

  if (nameField.value.length < 5) {
    errors.push(" Name must be at least 5 characters long.");
  }
  if (!emailField.value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push("Please enter a valid email address!");
  }
  if (webSField.value.trim() && !webSField.value.trim().startsWith("http")) {
    errors.push(" Websites must contain http or https");
  }
  if (
    imgURLField.value.trim() &&
    !imgURLField.value.match(/\.(jpeg|jpg|gif|png)$/i)
  ) {
    errors.push(
      "Image should be in the format of a jpeg, a jpg, git or png only."
    );
  }
  if (!genderField || genderField.value === "") {
    errors.push("Must select a gender.");
  }

  const skillsChecked = Array.from(skillsField).some(
    (checkbox) => checkbox.checked
  );

  if (!skillsChecked) {
    errors.push("At least one skill must be selected");
  }
  // Display Errors
  if (errors.length > 0) {
    errorText.innerHTML = errors.join("<br>");
    return false; // Validation failed
  }

  return true; // Validation successful
}

// adding an eventlistener to the form
formField.addEventListener("submit", addStudentsData);

// function to submit the enrollment data
function addStudentsData(event) {
  event.preventDefault();

  //checking for validations
  if (!validateFields()) {
    return;
  }
  // accessing all formValues
  const formData = new FormData(event.target);

  const formValues = {};

  // Storing each values in the object
  formData.forEach((value, key) => {
    formValues[key] = value;
  });

  // Collecting all selected skills into an array
  const selectedSkills = Array.from(skillsField)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  formValues["Student-skills"] = selectedSkills; // Store as an array

  // console.log(formValues);

  studentLists.push(formValues);
  // console.log(studentLists);

  // Saving studentLists to localStorage
  localStorage.setItem("studentLists", JSON.stringify(studentLists));

  showStudentList();
}

// function to clear the form inputs
function clearForm() {
  const clearBtn = document.getElementById("clear-form");
  clearBtn.addEventListener("click", (event) => {
    event.preventDefault();
    formField.reset();
    errorText.innerHTML = "";
  });
}
clearForm();

//showing all the students
function showStudentList() {
  const studentListContainer = document.getElementById("Student-card");
  studentListContainer.innerHTML = "";

  // If no students are present
  if (studentLists.length === 0) {
    studentListContainer.innerHTML = "<p>No Students to show!</p>";
    return;
  }

  // Loop through the student list and create cards
  studentLists.forEach((student) => {
    const studentCard = document.createElement("div");
    studentCard.className = "student-card";

    studentCard.innerHTML = `
      <div class="card-content">
        <h3>${student["Student-Name"] || "N/A"}</h3>
        <p><strong>Email:</strong> ${student["Student-email"] || "N/A"}</p>
        <p><strong>Website:</strong> 
          <a href="${student["Student-websites"] || "#"}" target="_blank">
            ${student["Student-websites"] || "N/A"}
          </a>
        </p>
        <div >
          <img 
            src="${student["Student-img-url"] || ""}" 
            alt="Student Image" 
            onerror="this.src='https://via.placeholder.com/150';"
            width="110" height="120"
          />
        </div>
        <p><strong>Gender:</strong> ${student["Student-gender"] || "N/A"}</p>
        <p><strong>Skills:</strong> ${
          student["Student-skills"].length > 0
            ? student["Student-skills"].join(", ")
            : "N/A"
        }</p>
      </div>
    `;

    studentListContainer.appendChild(studentCard);
  });
}
