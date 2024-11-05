import { CompanyModel } from 'src/company/models/company.model';
import {
  Check,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('timeslot')
@Check(
  'timeslot_hour_constraint',
  'start_hour >=0 AND start_hour <= 23 AND end_hour >= 0 AND end_hour <= 23',
)
@Check(
  'timeslot_minute_constraint',
  'start_minute >= 0 AND start_minute <= 59 AND end_minute >= 0 AND end_minute <= 59',
)
export class TimeslotModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'start_hour',
  })
  startHour: number;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'start_minute',
  })
  startMinute: number;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'end_hour',
  })
  endHour: number;

  @Column({
    type: 'integer',
    nullable: false,
    name: 'end_minute',
  })
  endMinute: number;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => CompanyModel, (company) => company.uuid, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'company_uuid',
  })
  company?: CompanyModel;
}
