// API client helper functions for backend and AI service integrations
// Returns mock JSON for now; swapping to real API endpoints touches only this file

import mockCourses from "@/mock/courses.json";
import mockJobs from "@/mock/jobs.json";

/**
 * Fetch available accessible courses.
 * @returns {Promise<Array>} List of courses
 */
export async function getCourses() {
  // Simulate network latency for realistic loading states
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCourses);
    }, 200);
  });
}

/**
 * Fetch inclusive job listings with accessibility tags.
 * @returns {Promise<Array>} List of job postings
 */
export async function getJobs() {
  // Simulate network latency for realistic loading states
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobs);
    }, 200);
  });
}
