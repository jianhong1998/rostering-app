import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { TimeslotModel } from './timeslot.model';

@Entity('weekday_timeslot')
@Unique('weekday_timeslot_ak', ['weekdayNumber', 'timeslot'])
@Check(
  'weekday_timeslot_weekday_number_constraint',
  'weekday_number BETWEEN 1 AND 7',
)
export class WeekdayTimeslotModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'weekday_number',
  })
  weekdayNumber: number;

  @ManyToOne(() => TimeslotModel, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'timeslot_uuid',
  })
  timeslot?: TimeslotModel;
}
