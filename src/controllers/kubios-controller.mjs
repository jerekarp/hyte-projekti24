import 'dotenv/config';
import fetch from 'node-fetch';
// import {customError} from '../middlewares/error-handler.mjs';

// Kubios API base URL should be set in .env
const baseUrl = process.env.KUBIOS_API_URI;

/**
* Get user data from Kubios API example
* TODO: Implement error handling
* @async
* @param {Request} req Request object including Kubios id token
* @param {Response} res
* @param {NextFunction} next
*/
const getUserData = async (req, res, next) => {
  const {kubiosIdToken} = req.user;
  const headers = new Headers();
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  headers.append('Authorization', kubiosIdToken);

  const response = await fetch(
    // TODO: set the from date in request parameters
    baseUrl + '/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00',
    {
      method: 'GET',
      headers: headers,
    },
  );
  const results = await response.json();
  return res.json(results);
};

/**
* Get user info from Kubios API example
* TODO: Implement error handling
* @async
* @param {Request} req Request object including Kubios id token
* @param {Response} res
* @param {NextFunction} next
*/
const getUserInfo = async (req, res, next) => {
  const {kubiosIdToken} = req.user;
  const headers = new Headers();
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  headers.append('Authorization', kubiosIdToken);

  const response = await fetch(baseUrl + '/user/self', {
    method: 'GET',
    headers: headers,
  });
  const userInfo = await response.json();
  return res.json(userInfo);
};

const getFilteredData = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;
    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', kubiosIdToken);

    const response = await fetch(baseUrl + '/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00', {
      method: 'GET',
      headers: headers,
    });

    const data = await response.json();

    // Suorita filtteröinti
    const filteredData = data.results.map(result => ({
      measured_timestamp: result.measured_timestamp,
      stress_index: result.result.stress_index,
      respiratory_rate: result.result.respiratory_rate,
      mean_hr_bpm: result.result.mean_hr_bpm,
      rmssd_ms: result.result.rmssd_ms,
      user_happiness: result.user_happiness
    }));

    return res.json({ status: 'ok', filteredData });
  } catch (error) {
    // Käsittely virheitä, jos niitä tapahtuu
    console.error('Error occurred:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export {getUserData, getUserInfo, getFilteredData};
