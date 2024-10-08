import axios from 'axios';
import { EnvironmentVariableUtil } from './environment-variable.util';

const { serverHost, clientHost } = EnvironmentVariableUtil.getEnvVarList();

export const ServerAxiosClient = axios.create({
  baseURL: `${serverHost}`,
});

export const NextAxiosClient = axios.create({
  baseURL: `${clientHost}`,
});
