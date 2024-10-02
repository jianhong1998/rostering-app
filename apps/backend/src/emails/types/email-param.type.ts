export interface IEmailParam<EmailParamType extends object> {
  params: EmailParamType;
  addresses: {
    from: string;
    to: string;
    replyTo?: string;
  };
}
