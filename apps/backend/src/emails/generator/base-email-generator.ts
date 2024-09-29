import { readFileSync } from 'fs';
import { join } from 'path';

export abstract class BaseEmailGenerator {
  protected readonly templateFileName: string;
  protected readonly generatorId: string;
  protected readonly paramList: string[];
  protected readonly emailSubjectTemplate: string;

  constructor(params: {
    templateFileName: string;
    generatorId: string;
    paramList: string[];
    emailSubjectTemplate: string;
  }) {
    const { emailSubjectTemplate, generatorId, paramList, templateFileName } =
      params;

    this.templateFileName = templateFileName;
    this.generatorId = generatorId;
    this.paramList = paramList;
    this.emailSubjectTemplate = emailSubjectTemplate;
  }

  protected generateEmailContent(emailParams: Record<string, string>): {
    subject: string;
    emailBody: string;
  } {
    const subjectTemplate = this.emailSubjectTemplate;
    const emailContentTemplate = this.readTemplateFile();

    if (
      !this.isAllRequiredParamsReceived({
        emailSubject: subjectTemplate,
        emailTemplateHtml: emailContentTemplate,
        emailParams,
      })
    ) {
      throw new Error('Missing email params');
    }

    const { emailContentHtml, subject } = this.fillInEmailTemplate({
      emailContentTemplate,
      subjectTemplate,
      emailValues: { ...emailParams },
    });

    return {
      subject,
      emailBody: emailContentHtml,
    };
  }

  private fillInEmailTemplate(params: {
    subjectTemplate: string;
    emailContentTemplate: string;
    emailValues: Record<string, string>;
  }): {
    subject: string;
    emailContentHtml: string;
  } {
    const { emailContentTemplate, emailValues, subjectTemplate } = params;

    const values = Object.entries(emailValues);
    let subject = subjectTemplate;
    let emailContentHtml = emailContentTemplate;

    for (const [key, value] of values) {
      const regExp = new RegExp(`{{${key}}}`, 'g');

      subject = subject.replace(regExp, value);
      emailContentHtml = emailContentHtml.replace(regExp, value);
    }

    return {
      subject,
      emailContentHtml,
    };
  }

  private isAllRequiredParamsReceived(params: {
    emailTemplateHtml: string;
    emailSubject: string;
    emailParams: Record<string, string>;
  }) {
    const { emailParams, emailSubject, emailTemplateHtml } = params;
    const requiredKeySet = new Set<string>();
    const missingKeys = [] as string[];
    const regExp = /{{(.*?)}}/g;

    let execResultArray = regExp.exec(emailTemplateHtml);
    while (execResultArray !== null) {
      requiredKeySet.add(execResultArray[1]);

      execResultArray = regExp.exec(emailTemplateHtml);
    }

    execResultArray = regExp.exec(emailSubject);
    while (execResultArray !== null) {
      requiredKeySet.add(execResultArray[1]);
      execResultArray = regExp.exec(emailSubject);
    }

    requiredKeySet.forEach((key) => {
      if (!(key in emailParams)) {
        missingKeys.push(key);
      }
    });

    if (missingKeys.length) {
      console.log(`Key(s) missing: [${missingKeys.join(', ')}]`);
    }

    return missingKeys.length === 0;
  }

  private readTemplateFile(): string {
    const fullFilePath = join(__dirname, '../templates', this.templateFileName);

    let fileString = readFileSync(fullFilePath).toString();

    fileString = fileString.replace(/\n/g, '');

    return fileString;
  }
}
