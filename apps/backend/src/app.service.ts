import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  public async healthCheck(): Promise<boolean> {
    return true;
  }
}
