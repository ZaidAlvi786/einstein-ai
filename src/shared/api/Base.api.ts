import { AxiosResponse } from 'axios';
import { axiosInstance } from './Interceptor';
import { clearAllStorage } from '@helpers/storage.helper';
import { API } from '@constants/api.constant';

export const createRequest = (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = null,
  contentType:
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded' = 'application/json'
): Promise<any> => {
  const url = endpoint;
  const headers = { accept: 'application/json', 'content-Type': contentType };
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await axiosInstance({
        url,
        method,
        headers,
        data,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createRequestFormData = (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = null
): Promise<any> => {
  const url = endpoint;
  const headers = {
    'Content-Type': 'multipart/form-data',
    accept: 'multipart/form-data',
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await axiosInstance({
        url,
        method,
        headers,
        data,
      });
      return resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const logout = () => {
  clearAllStorage();
  window.location.href = '/login';
};

export const getGoogleUrl = async () => {
  return await createRequest(API.GOOLE_AUTH.GOOGLE_URL, 'POST', {});
};
