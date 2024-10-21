import { CompanyModel } from 'src/company/models/company.model';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Company1726575245505 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction('SERIALIZABLE', async (manager) => {
      const COMPANY_UUID = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';

      const company = new CompanyModel();
      company.uuid = COMPANY_UUID;
      company.name = 'Test Company Pte Ltd';

      await manager.save([company]);
    });
  }
}
