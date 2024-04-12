//Import Axios library for making HTTP requests
const axios = require('axios');

//Define DevRev PAT and API endpoint URL
const patId = 'eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFZbk1NWEJQT086ZGV2dS8xIiwiZXhwIjoxODA3MTYyMjkxLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VpZCI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by9zdXBlcjphdXRoMF91c2VyL2xpbmtlZGlufHpZNEpTNXl4NWwiLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJsaW5rZWRpbnx6WTRKUzV5eDVsIiwiaHR0cDovL2RldnJldi5haS9kZXZvX2RvbiI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xWW5NTVhCUE9PIiwiaHR0cDovL2RldnJldi5haS9kZXZvaWQiOiJERVYtMVluTU1YQlBPTyIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6Im5pc2htaXRoYSIsImh0dHA6Ly9kZXZyZXYuYWkvZW1haWwiOiJuaXNobWl0aGFwZXJkb29yQGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJOaXNobWl0aGEiLCJodHRwOi8vZGV2cmV2LmFpL2lzX3ZlcmlmaWVkIjp0cnVlLCJodHRwOi8vZGV2cmV2LmFpL3Rva2VudHlwZSI6InVybjpkZXZyZXY6cGFyYW1zOm9hdXRoOnRva2VuLXR5cGU6cGF0IiwiaWF0IjoxNzEyNTU0MjkxLCJpc3MiOiJodHRwczovL2F1dGgtdG9rZW4uZGV2cmV2LmFpLyIsImp0aSI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xWW5NTVhCUE9POnRva2VuL3JEbTROczFlIiwib3JnX2lkIjoib3JnX0doNWNxcmhCVGNCMzlWZ2UiLCJzdWIiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMVluTU1YQlBPTzpkZXZ1LzEifQ.YLVXPctDrx3kGVBPf9GJs4tAVKfG9GLSsd3erDrxkgdm3KWSjoILDBCEb5maRoSsFW429QAk_esrGB4cANZ0vHAkHsnH6BrCrT9pKTgc82XdjV8uNXhlWxCed0gOLlmDsjvcSJWtw1hV0TFA1a2mgRLD3dRAB1fwb4WCor5lhSPO9YX3O9KamVbNGMVGu9qwzUC4dk8sBnWLYsPZMZYekha_wWOCd8rG0VITwQaAXAx8467uZPw_K2K63mGiJliokjMlFTM0qWhb0CIPtM5WvnPqf70bObWPzFjl1mQ7JndzeSTWnPPw8exV0ChwyahowiUSsyEyJGVgBLjLcs6gcg';
const apiUrl = 'https://api.devrev.ai/works.create';

//Define a payload data for creating a work item
const payload = {
  type: 'issue',
  applies_to_part: 'don:core:dvrv-us-1:devo/1YnMMXBPOO:product/1',
  owned_by: ['don:identity:dvrv-us-1:devo/1YnMMXBPOO:devu/1'],
  title: 'demowithsnapin'
};

//Headers required for the HTTP request
const headers = {
  'Authorization': `Bearer ${patId}`, 
  'Content-Type': 'application/json'
};

//Log a message indicating the start of the HTTP POST request
console.log('Sending HTTP POST request...');

//Make an asynchronous HTTP POST request to create the work item
axios.post(apiUrl, payload, { headers:headers })

// Handle the successful response from the API
  .then(response => {
    console.log('Response received successfully!');
    console.log(response.data); // Log the work item details returned by the API 
  })

  // Handle any errors that occur during the HTTP request
  .catch(error => {
    console.error('Error creating work item:', error.response.data); //Log the error message and response data (if available)
  });
