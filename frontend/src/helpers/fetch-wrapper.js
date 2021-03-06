
import { accountServices } from "services";

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url)
  }
  return fetch(url, requestOptions).then(handleRequest)
}

function post(url, body) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    credentials: "include",
    body: JSON.stringify(body)
  }
  return fetch(url, requestOptions).then(handleRequest)
}

function post_multipartdata(url, data) {

  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  // formData.append('file', data.file);

  const requestOptions = {
    method: "POST",
    // headers: { "Content-Type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s', ...authHeader(url) },
    headers: authHeader(url),
    body: formData
  }

  return fetch(url, requestOptions).then(handleRequest)
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    credentials: "include",
    body: JSON.stringify(body)
  }
  return fetch(url, requestOptions).then(handleRequest)
}

function _delete(url, body) {
  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", authHeader(url).Authorization);
  // myHeaders.append("Authorization", authHeader(url).Authorization);
  // myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: "DELETE",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...authHeader(url) },
  }
  return fetch(url, requestOptions).then(handleRequest)
}


function authHeader(url) {
  const user = accountServices.userValue;

  const isLoggedIn = user && user.access_token

  if (isLoggedIn) {
    return { Authorization: `Bearer ${user.access_token}` };
  }
  else {
    return {}
  }
}

function handleRequest(response) {
  return response.text().then(text => {
    const data = JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.detail) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

export const fetchWrapper = {
  get,
  post,
  post_multipartdata,
  put,
  delete: _delete
}