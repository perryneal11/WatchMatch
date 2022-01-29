// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Friendship, User } = initSchema(schema);

export {
  Friendship,
  User
};