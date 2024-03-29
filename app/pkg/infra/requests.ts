import type { Auth, MetaToken, User } from "./types";

export type LoginRespose = {
  data: User | string;
  meta: MetaToken;
};

export type GetUserResponse = {
  Data: User;
};

export type GetByTokenResponse = {
  Data: Auth;
};
