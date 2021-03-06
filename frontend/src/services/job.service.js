import { fetchWrapper } from "helpers"
import { Config } from '../config/consts'


function getJob(job_id) {
  return fetchWrapper.get(Config.backendUrl + `/api/job/get?id=${job_id}`)
}

function listJob(account_id) {
  return fetchWrapper.get(Config.backendUrl + `/api/job/list?id=${account_id}`)
}

function deleteJob(id) {
  return fetchWrapper.delete(Config.backendUrl + `/api/job/delete`, { id })
}

function createJob(title, description, seniority_level, employment_type, recruitment_url, cities, skills) {
  return fetchWrapper.post(Config.backendUrl + `/api/job/create`, { title, description, seniority_level, employment_type, recruitment_url, cities, skills })
}

function updateJob(id, title, description, seniority_level, employment_type, recruitment_url, cities, skills) {
  return fetchWrapper.put(Config.backendUrl + `/api/job/update`, { id, title, description, seniority_level, employment_type, recruitment_url, cities, skills })
}

function uploadJobPicture(data) {
  return fetchWrapper.post_multipartdata(Config.backendUrl + '/api/job/upload', data)
}

export const jobServices = {
  getJob,
  listJob,
  deleteJob,
  createJob,
  updateJob,

  uploadJobPicture
}