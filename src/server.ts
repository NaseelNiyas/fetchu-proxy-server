/**
 * @author Naseel Niyas
 * @license MIT
 */

import cors from 'cors';
import express from 'express';
import { updateEndTime } from './utils';
const morgan = require('morgan');
import axios, { Method } from 'axios';

const app = express();
morgan('dev');
app.use(cors());
app.use(express.json());

axios.interceptors.request.use((request) => {
  // @ts-ignore
  request.customData = request.customData || {};
  // @ts-ignore
  request.customData.startTime = new Date().getTime();
  return request;
});
axios.interceptors.response.use(updateEndTime, function (e) {
  if (e) {
    updateEndTime(e);
  }
  return Promise.reject(updateEndTime(e));
});

const PORT = process.env.PORT || 3003;

app.post(['/'], async (req, res) => {
  try {
    const response = await axios(req.body.data.url, {
      headers: req.body.data.headers || undefined,
      method: <Method>req.body.data.method || 'get',
      data: req.body.data.bodyData || undefined,
    });

    res.json({
      data: response.data,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      // @ts-ignore
      time: response.customData.time,
      size:
        JSON.stringify(response.headers).length +
        JSON.stringify(response.data).length,
      config: response.config
    });
  } catch (error: any) {
    if (error.response !== undefined) {
      return res.json({
        data: error.response.data,
        headers: error.response.headers,
        status: error.response.status,
        statusText: error.response.statusText,
        // @ts-ignore
        time: null,
      });
    }
    res.status(500).json({
      message: `Error Making Request: , ${error.message}`,
    });
    console.log('ERR: ', error);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy Server running on port ${PORT}`);
});
