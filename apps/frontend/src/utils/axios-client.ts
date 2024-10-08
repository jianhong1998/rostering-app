import axios from 'axios';
import { EnvironmentVariableUtil } from './environment-variable.util';

const { serverHost } = EnvironmentVariableUtil.getEnvVarList();

export const AxiosClient = axios.create({
  baseURL: `${serverHost}`,
});
