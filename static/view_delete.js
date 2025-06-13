const api = "https//127.0.0.1:5000/api/jobs";

async function fetchJobs() {
  const res = await fetch(api);
  const jobs = await res.json();

  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";
jobList.style.display = "flex";
jobList.style.flexWrap = "wrap";
jobList.style.gap = "20px";


  jobs.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.className = "job-card";
    jobDiv.innerHTML = `
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Role:</strong> ${job.role}</p>
      <p><strong>Status:</strong> ${job.status}</p>
      <p><strong>Date Applied:</strong> ${job.dateApplied}</p>
      <p><strong>Notes:</strong> ${job.notes}</p>
      <div>
        <a href="/update?id=${job.jobId}" class="btn btn-update">Update</a>
        <button onclick="deleteJob('${job.jobId}')" class="btn btn-delete">Delete</button>
      </div>
    `;
    jobList.appendChild(jobDiv);
  });
}

async function deleteJob(id) {
  const res = await fetch(`${api}/${id}`, { method: "DELETE" });

  if (res.ok) {
    showMessage("Job deleted successfully!");
    fetchJobs();
  } else {
    showMessage("Failed to delete job.", true);
  }
}

function showMessage(message, isError = false) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = message;
  msgDiv.style.color = isError ? "red" : "green";
  msgDiv.style.display = "block";
  setTimeout(() => {
    msgDiv.style.display = "none";
  }, 3000);
}

window.onload = fetchJobs;

