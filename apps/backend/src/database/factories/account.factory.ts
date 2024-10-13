// import { hash } from 'argon2';
import { randomUUID } from 'crypto';
import { AccountType } from 'src/user/enums/account-type';
import { AccountModel } from 'src/user/models/account.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(AccountModel, async (faker) => {
  const account = new AccountModel();

  account.uuid = randomUUID();
  account.accountType = AccountType.EMAIL;
  account.email = faker.internet
    .email({ provider: 'jianhong.link' })
    .toLowerCase();
  // account.hashedPassword = await hash('password', {
  //   secret: Buffer.from(process.env.PASSWORD_HASH_SECRET ?? ''),
  // });

  return account;
});
