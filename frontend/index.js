
const api = 'http://127.0.0.1:5000/api/jobs';


let editMode = false;
let editingId = null;

async function fetchJobs() {
  const res = await fetch(api);
  const jobs = await res.json();
  document.getElementById('jobList').innerHTML = jobs.map(job => `
    <div>
      <strong>${job.company}</strong> - ${job.role}
      <button onclick="editJob('${job.jobId}')">Edit</button>
      <button onclick="deleteJob('${job.jobId}')">Delete</button>
    </div>
  `).join('');
}

async function deleteJob(id) {
  await fetch(`${api}/${id}`, { method: 'DELETE' });
  fetchJobs();
}

function editJob(id) {
  fetch(`${api}`)
    .then(res => res.json())
    .then(jobs => {
      const job = jobs.find(j => j.jobId === id);
      if (job) {
        company.value = job.company;
        role.value = job.role;
        status.value = job.status;
        dateApplied.value = job.dateApplied;
        notes.value = job.notes;
        editMode = true;
        editingId = id;
        document.getElementById('cancelEdit').style.display = 'inline';
      }
    });
}

document.getElementById('cancelEdit').addEventListener('click', () => {
  editMode = false;
  editingId = null;
  jobForm.reset();
  document.getElementById('cancelEdit').style.display = 'none';
});

document.getElementById('jobForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    company: company.value,
    role: role.value,
    status: status.value,
    dateApplied: dateApplied.value,
    notes: notes.value
  };

  if (editMode) {
    await fetch(`${api}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    editMode = false;
    editingId = null;
    document.getElementById('cancelEdit').style.display = 'none';
  } else {
    await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  jobForm.reset();
  fetchJobs();
});

// Initial load
fetchJobs();
