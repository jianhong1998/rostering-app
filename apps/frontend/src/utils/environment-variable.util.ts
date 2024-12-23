type IEnvironmentVariableList = {
  serverHost: string;
  clientHost: string;
};

export class EnvironmentVariableUtil {
  public envVars: IEnvironmentVariableList;

  private static instance: EnvironmentVariableUtil;

  private constructor() {
    this.envVars = {
      serverHost: process.env.SERVER_HOST ?? 'http://localhost:3001',
      clientHost: process.env.CLIENT_HOST ?? 'http://localhost:3000',
    };
  }

  public static getEnvVarList(): IEnvironmentVariableList {
    return this.getInstance().envVars;
  }

  private static getInstance(): EnvironmentVariableUtil {
    if (!this.instance) {
      this.instance = new EnvironmentVariableUtil();
    }

    return this.instance;
  }
}
