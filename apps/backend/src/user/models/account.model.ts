import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountType } from '../enums/account-type';

@Entity('account')
export class AccountModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

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
