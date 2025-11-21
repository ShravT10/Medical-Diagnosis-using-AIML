export const API_URL = "http://127.0.0.1:5000";

export async function getHistory() {
  const response = await fetch(`${API_URL}/history`);
  return response.json();
}

export async function createPrediction(data) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function updateRecord(id, data) {
  const response = await fetch(`${API_URL}/edit/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteRecord(id) {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE"
  });
  return response.json();
}

export async function createAmbulance(data) {
  const res = await fetch(`${API_URL}/ambulance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getAmbulance() {
  const res = await fetch(`${API_URL}/ambulance`);
  return res.json();
}

export async function bookTest(payload) {
  const res = await fetch(`${API_URL}/book-test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getBill(patientId) {
  const res = await fetch(`${API_URL}/bill/${patientId}`);
  return res.json();
}

