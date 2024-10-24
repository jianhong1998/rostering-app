import { randomUUID } from 'crypto';
import { CompanyModel } from 'src/company/models/company.model';
import { UserModel } from 'src/user/models/user.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserModel, async (faker) => {
  const COMPANY_UUID = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';
  const company = new CompanyModel();
  company.uuid = COMPANY_UUID;

  const user = new UserModel();
  user.uuid = randomUUID();
  user.fullName = faker.person.fullName();
  user.phoneCountryCode = 60;
  user.phoneNumber = faker.number.int({ min: 100000000, max: 199999999 });
  user.company = company;

  return user;
});
