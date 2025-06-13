
const api =  "https://job-render.onrender.com/api/jobs"


const jobForm = document.getElementById("jobForm");

jobForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const jobData = {
    company: jobForm.company.value,
    role: jobForm.role.value,
    status: jobForm.status.value,
    dateApplied: jobForm.dateApplied.value,
    notes: jobForm.notes.value, // Fixed: was `note` before
  };

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  if (res.ok) {
    showMessage("Job added successfully!");
    jobForm.reset();
  } else {
    showMessage("Failed to add job.", true);
  }
});

function showMessage(msg, isError = false) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? "red" : "green";
  messageDiv.style.display = "block";

  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}
