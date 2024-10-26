import { CompanyModel } from 'src/company/models/company.model';
import { TimeslotModel } from 'src/timeslot/models/timeslot.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Timeslot1729813228620 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const COMPANY_UUID = 'f5c5fef6-9e3a-4cf4-99a3-5f68978cd571';

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
    });
  }
}
