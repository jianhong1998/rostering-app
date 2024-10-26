import { CompanyModel } from 'src/company/models/company.model';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountModel } from './account.model';

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'full_name',
  })
  fullName: string;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'phone_number',
  })
  phoneNumber: number;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'phone_country_code',
  })
  phoneCountryCode: number;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @OneToOne(() => AccountModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'account_uuid',
  })
  account?: AccountModel;

  @ManyToOne(() => CompanyModel, {
    onDelete: 'CASCADE',
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'company_uuid',
  })
  company: CompanyModel;
}
