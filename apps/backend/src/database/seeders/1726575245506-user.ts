import { randomUUID } from 'crypto';
import { AccountType } from 'src/user/enums/account-type';
import { AccountModel } from 'src/user/models/account.model';
import { UserModel } from 'src/user/models/user.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class User1726575245506 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await dataSource.transaction('SERIALIZABLE', async (manager) => {
      const TOTAL_USER = 10;
      const userFactory = factoryManager.get(UserModel);
      const accountFactory = factoryManager.get(AccountModel);

      const savedAccounts = await accountFactory.saveMany(TOTAL_USER);
      const savedUsers = await userFactory.saveMany(TOTAL_USER);

      if (savedAccounts.length !== savedUsers.length)
        throw new Error('Saved accounts and users are not same number');

      console.log(`Saved user: ${savedUsers.map((user) => user.uuid)}`);

      savedUsers.forEach((user, index) => {
        user.account = savedAccounts[index];
      });

      await manager.save(savedUsers);

      const userToBeDeleted = savedUsers.filter((_, index) => index % 5 === 0);
      const deletedUser = await manager.softRemove(userToBeDeleted);

      if (deletedUser.length !== userToBeDeleted.length)
        throw new Error(
          `Not all user been deleted: ${deletedUser.length} (Deleted) & ${userToBeDeleted.length} (To be deleted)`,
        );

      // User with real email
      const userAccount = new AccountModel();
      userAccount.uuid = randomUUID();
      userAccount.accountType = AccountType.EMAIL;
      userAccount.email = 'jianhong@jianhong.link';
      userAccount.hashedPassword = '';
      await manager.save([userAccount]);

      const user = new UserModel();
      user.uuid = randomUUID();
      user.account = userAccount;
      user.fullName = 'Jian Hong';
      user.phoneCountryCode = 65;
      user.phoneNumber = 98765432;
      await manager.save([user]);
    });
  }
}
