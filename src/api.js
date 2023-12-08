import axios from "axios";

axios.interceptors.response.use(
  function (response) {
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const baseUrl = "https://testnet-api.burst.wtf";

export const getTokenPrice = (params) => {
  return axios.get(`${baseUrl}/burst/token_price`);
};

export const getLockInfo = (params) => {
  return axios.get(`${baseUrl}/burst/burst_lock_info`);
};

export const getStakeWblurInfo = (params) => {
  return axios.get(`${baseUrl}/burst/staking_wblur_info`);
};

export const getClaimPoolInfo = (params) => {
  return axios.get(`${baseUrl}/burst/claimable_pool_list`);
};

export const getLPPoolInfo = (params) => {
  return axios.get(`${baseUrl}/burst/pool_list`);
};
