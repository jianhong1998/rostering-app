import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserModel extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
    nullable: false,
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  hashedPassword: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  phoneNumber: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  phoneCountryCode: number;
}
