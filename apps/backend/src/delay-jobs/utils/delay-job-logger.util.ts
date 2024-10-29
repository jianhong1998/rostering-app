export class DelayJobLogger {
  private logKey: string;

  constructor(logKey: string) {
    this.logKey = `[${logKey}]`;
  }

  public log(message: unknown) {
    if (typeof message === 'object' && message !== null) {
      console.log(`${this.logKey}\n${JSON.stringify(message)}`);
      return;
    }

    console.log(`${this.logKey} - ${message}`);
  }

  public error(message: unknown) {
    if (
      typeof message === 'object' &&
      message !== null &&
      message instanceof Error
    ) {
      console.error(`${this.logKey} - ${message.name} - ${message.message}`);
      return;
    }

    console.error(message);
  }

  public debug(message: unknown) {
    if (typeof message === 'object' && message !== null) {
      console.debug(`[DEBUG] - ${this.logKey}\n ${JSON.stringify(message)}`);
      return;
    }

    console.debug(`[DEBUG] - ${this.logKey} - ${message}`);
  }

  public warn(message: unknown) {
    if (typeof message === 'object' && message !== null) {
      console.warn(`[WARN] - ${this.logKey}\n ${JSON.stringify(message)}`);
      return;
    }

    console.warn(`[WARN] - ${this.logKey} - ${message}`);
  }
}
