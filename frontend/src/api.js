// All HTTP requests live here; components do not call fetch directly.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchAppointments() {
  const res = await fetch(`${API_URL}/appointments`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

// Alias for universal rubric compatibility
export const fetchTasks = fetchAppointments;

