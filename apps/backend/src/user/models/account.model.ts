import {
  BaseEntity,
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { AccountType } from '../enums/account-type';

@Entity('account')
@Check(
  'account_type_password_constraint',
  `"account_type" = 'EMAIL' AND "hashed_password" IS NOT NULL`,
)
export class AccountModel extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
  })
  uuid: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'hashed_password',
  })
  hashedPassword: string | null;

  @Column({
    type: 'enum',
    enum: AccountType,
    enumName: 'account_account_type',
    nullable: false,
    name: 'account_type',
  })
  accountType: AccountType;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
