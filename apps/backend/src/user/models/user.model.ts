import { CompanyModel } from 'src/company/models/company.model';
import {
  BaseEntity,
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
export class UserModel extends BaseEntity {
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

  @OneToOne(() => AccountModel, { onDelete: 'CASCADE' })
  @JoinColumn()
  account?: AccountModel;

  @ManyToOne(() => CompanyModel)
  @JoinColumn({
    name: 'company_uuid',
  })
  company: CompanyModel;
}
