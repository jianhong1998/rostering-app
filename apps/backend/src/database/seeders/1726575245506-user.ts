import { randomInt, randomUUID } from 'crypto';
import { CompanyModel } from 'src/company/models/company.model';
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
    const COMPANY_UUID = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';

    const numberOfExistingUsers = await dataSource.manager.countBy(UserModel, {
      company: {
        uuid: COMPANY_UUID,
      },
    });

    if (numberOfExistingUsers > 0) {
      console.log('Users are already exist.\n');
      return;
    }

    await dataSource.transaction('SERIALIZABLE', async (manager) => {
      const TOTAL_USER = 10;
      const userFactory = factoryManager.get(UserModel);

      const company = await manager.findOneBy(CompanyModel, {
        uuid: COMPANY_UUID,
      });

      if (!company) throw new Error('Company is not created yet');

      const users = [] as UserModel[];
      const accounts = [] as AccountModel[];

      for (let count = 0; count < TOTAL_USER; count++) {
        users.push(await userFactory.make(undefined, false));
      }

      // Modify users with associating account and company
      users.forEach((user) => {
        const username = user.fullName.split(' ').join('_').toLowerCase();
        const randomNumber = randomInt(1, 99);

        const account = new AccountModel();
        account.accountType = AccountType.EMAIL;
        account.email = `${username}_${randomNumber}@jianhong.link`;

        accounts.push(account);

        user.account = account;
        user.company = company;
      });

      const realUsers = this.generateRealUsers({ company });

      users.push(...realUsers.users);
      accounts.push(...realUsers.accounts);

      await manager.save(accounts);
      await manager.save(users);

      const userToBeDeleted = users.filter(
        (user, index) => index % 5 === 0 && !realUsers.users.includes(user),
      );
      const deletedUser = await manager.softRemove(userToBeDeleted);

      if (deletedUser.length !== userToBeDeleted.length)
        throw new Error(
          `Not all user been deleted: ${deletedUser.length} (Deleted) & ${userToBeDeleted.length} (To be deleted)`,
        );

      console.log(
        `Users created: [ ${users.map((user) => user.uuid).join(' / ')} ]\n`,
      );
    });
  }

  private generateRealUsers(params: { company: CompanyModel }): {
    users: UserModel[];
    accounts: AccountModel[];
  } {
    const { company } = params;

    // User 1
    const userAccount1 = new AccountModel();
    userAccount1.uuid = randomUUID();
    userAccount1.accountType = AccountType.EMAIL;
    userAccount1.email = 'jianhong@jianhong.link';

    const user1 = new UserModel();
    user1.uuid = randomUUID();
    user1.fullName = 'Jian Hong';
    user1.phoneCountryCode = 65;
    user1.phoneNumber = 98765432;
    user1.account = userAccount1;
    user1.company = company;

    return {
      users: [user1],
      accounts: [userAccount1],
    };
  }
}
