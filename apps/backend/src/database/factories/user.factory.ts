import { randomUUID } from 'crypto';
import { UserModel } from 'src/user/models/user.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserModel, async (faker) => {
  const user = new UserModel();

  user.uuid = randomUUID();
  user.fullName = faker.person.fullName();
  user.phoneCountryCode = 60;
  user.phoneNumber = faker.number.int({ min: 100000000, max: 199999999 });

  return user;
});
