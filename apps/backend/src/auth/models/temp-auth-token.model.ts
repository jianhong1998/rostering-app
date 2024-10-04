import { UserModel } from 'src/user/models/user.model';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth_token')
export class TempAuthTokenModel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn()
  user?: UserModel;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    name: 'expire_at',
  })
  expiredAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
