import { CompanyModel } from 'src/company/models/company.model';

export interface ITimeslotCreationParams {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  company: CompanyModel;
}
