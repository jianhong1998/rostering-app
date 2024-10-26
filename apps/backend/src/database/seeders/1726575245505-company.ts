import { CompanyModel } from 'src/company/models/company.model';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Company1726575245505 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    const COMPANY_UUID = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';

    const existingCompany = await dataSource.manager.countBy(CompanyModel, {
      uuid: COMPANY_UUID,
    });

    if (existingCompany) {
      console.log('Company already exist.\n');
      return;
    }

    await dataSource.transaction('SERIALIZABLE', async (manager) => {
      const company = new CompanyModel();
      company.uuid = COMPANY_UUID;
      company.name = 'Test Company Pte Ltd';

      const createdCompany = await manager.save(company);

      console.log(`Company created: [ ${createdCompany.uuid} ]\n`);
    });
  }
}
