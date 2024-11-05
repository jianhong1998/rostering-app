import { WeekdayTimeslotModel } from 'src/timeslot/models/weekday-timeslot.model';
import { UserModel } from 'src/user/models/user.model';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({
  name: 'default_availability',
})
@Unique('default_availability_ak', ['user'])
export class DefaultAvailabilityModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => UserModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_uuid',
  })
  user: UserModel;

  @ManyToMany(() => WeekdayTimeslotModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'default_availability_weekday_timeslot',
  })
  weekdayTimeslots: WeekdayTimeslotModel[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
