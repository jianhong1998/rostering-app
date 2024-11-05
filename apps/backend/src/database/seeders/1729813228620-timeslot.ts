import { CompanyModel } from 'src/company/models/company.model';
import { TimeslotModel } from 'src/timeslot/models/timeslot.model';
import { WeekdayTimeslotModel } from 'src/timeslot/models/weekday-timeslot.model';
import { DataSource, EntityManager } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Timeslot1729813228620 implements Seeder {
  track = false;
  private companyUuid = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const COMPANY_UUID = this.companyUuid;

    const numberOfTimeslotExist = await dataSource.manager.countBy(
      TimeslotModel,
      {
        company: {
          uuid: COMPANY_UUID,
        },
      },
    );

    if (numberOfTimeslotExist > 0) {
      console.log('Timeslots are already exist.\n');
      return;
    }

    await dataSource.transaction('SERIALIZABLE', async (manager) => {
      const company = await manager.findOneBy(CompanyModel, {
        uuid: COMPANY_UUID,
      });

      if (!company) throw new Error('Company is not created yet');

      const timeslots = [
        new TimeslotModel(),
        new TimeslotModel(),
        new TimeslotModel(),
      ];

      const [morningShift, afternoonShift, nightShift] = timeslots;

      morningShift.startHour = 7;
      morningShift.startMinute = 0;
      morningShift.endHour = 15;
      morningShift.endMinute = 15;

      afternoonShift.startHour = 15;
      afternoonShift.startMinute = 0;
      afternoonShift.endHour = 23;
      afternoonShift.endMinute = 15;

      nightShift.startHour = 23;
      nightShift.startMinute = 0;
      nightShift.endHour = 7;
      nightShift.endMinute = 15;

      timeslots.forEach((timeslot) => {
        timeslot.company = company;
      });

      const createdTimeslots = await manager.save(timeslots);

      console.log(
        `Timeslot created: [ ${createdTimeslots.map((timeslot) => timeslot.uuid).join(' / ')} ]\n`,
      );

      const createdWeekdayTimeslots = await this.createWeekdayTimeslots(
        createdTimeslots,
        manager,
      );

      console.log(
        `Weekday Timeslot created: [ ${createdWeekdayTimeslots.map((weekdayTimeslot) => weekdayTimeslot.uuid).join(' / ')} ]\n`,
      );
    });
  }

  private async createWeekdayTimeslots(
    timeslots: TimeslotModel[],
    manager: EntityManager,
  ) {
    const newWeekdayTimeslots = [];
    let weekdayNumber = 1;

    while (weekdayNumber <= 7) {
      timeslots.forEach((timeslot) => {
        const weekdayTimeslot = new WeekdayTimeslotModel();

        weekdayTimeslot.timeslot = timeslot;
        weekdayTimeslot.weekdayNumber = weekdayNumber;

        newWeekdayTimeslots.push(weekdayTimeslot);
      });

      weekdayNumber++;
    }

    await manager.save(newWeekdayTimeslots);

    const createdWeekdayTimeslots = await manager.find(WeekdayTimeslotModel, {
      where: {
        timeslot: {
          company: {
            uuid: this.companyUuid,
          },
        },
      },
    });

    if (createdWeekdayTimeslots.length !== newWeekdayTimeslots.length) {
      console.error(
        `Failed to create weekday timeslots: number of created (${createdWeekdayTimeslots.length}) and number of to be created (${newWeekdayTimeslots.length}) are not match`,
      );
      throw new Error(
        `number of created (${createdWeekdayTimeslots.length}) and number of to be created (${newWeekdayTimeslots.length}) are not match`,
      );
    }

    return createdWeekdayTimeslots;
  }
}
