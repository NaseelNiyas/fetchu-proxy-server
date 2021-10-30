import { AxiosResponse } from 'axios';

export const updateEndTime = (response: AxiosResponse | any) => {
   if (response.status < 300) {
     // @ts-ignore
     response.customData = response.customData || {};
     // @ts-ignore
     response.customData.time =
       // @ts-ignore
       new Date().getTime() - response.config.customData.startTime;
   }
   return response;
 };
 
 