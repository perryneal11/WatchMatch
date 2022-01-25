import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type FriendshipMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Friendship {
  readonly id: string;
  readonly requestAccepted?: boolean;
  readonly Users?: (User | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Friendship, FriendshipMetaData>);
  static copyOf(source: Friendship, mutator: (draft: MutableModel<Friendship, FriendshipMetaData>) => MutableModel<Friendship, FriendshipMetaData> | void): Friendship;
}

export declare class User {
  readonly id: string;
  readonly Netflix?: boolean;
  readonly Prime?: boolean;
  readonly approvedContentIMDBID?: (string | null)[];
  readonly unapprovedContentIMDBID?: (string | null)[];
  readonly friends?: (string | null)[];
  readonly username: string;
  readonly awsID: string;
  readonly friendshipID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}