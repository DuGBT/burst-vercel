import axios from "axios";

axios.interceptors.response.use(
  function (response) {
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const baseUrl =
  "http://burst-testnet-431667704.ap-southeast-1.elb.amazonaws.com";

export const getTokenPrice = (params) => {
  return axios.get(`${baseUrl}/burst/token_price`);
};
export const getLockInfo = (params) => {
  return axios.get(`${baseUrl}/burst/burst_lock_info`);
};
export const getStakeWblurInfo = (params) => {
  return axios.get(`${baseUrl}/burst/staking_wblur_info`);
};
