export class QueueUtil {
  public queueNames: {
    emailQueue: string;
  };

  private static instance: QueueUtil;

  private constructor() {
    const emailQueue = process.env.SQS_NAME_EMAIL ?? '';

    this.queueNames = {
      emailQueue,
    };
  }

  public static getQueueNames() {
    const instance = this.getInstance();
    return instance.queueNames;
  }

  private static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new QueueUtil();
    return this.instance;
  }
}
