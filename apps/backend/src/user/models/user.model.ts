import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AccountModel } from './account.model';

@Entity('user')
export class UserModel extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
  })
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

  @OneToOne(() => AccountModel)
  @JoinColumn()
  account?: AccountModel;
}
