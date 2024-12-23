import { TempAuthTokenModel } from 'src/auth/models/temp-auth-token.model';
import { CompanyModel } from 'src/company/models/company.model';
import { TimeslotModel } from 'src/timeslot/models/timeslot.model';
import { AccountModel } from 'src/user/models/account.model';

import { UserModel } from '../user/models/user.model';

export const ENTITY_MODELS = [
  UserModel,
  AccountModel,
  TempAuthTokenModel,
  CompanyModel,
  TimeslotModel,
];
