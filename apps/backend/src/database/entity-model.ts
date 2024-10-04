import { TempAuthTokenModel } from 'src/auth/models/temp-auth-token.model';
import { AccountModel } from 'src/user/models/account.model';

import { UserModel } from '../user/models/user.model';

export const ENTITY_MODELS = [UserModel, AccountModel, TempAuthTokenModel];
