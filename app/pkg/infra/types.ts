export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
};

export type MetaToken = {
  token: string;
  verification_token: string;
};

export type Auth = {
  id: string;
  user_id: string;
  token: string;
  blacklist: boolean;
  kind: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

// Token Struct defined to append JWT standar values to Token struct
export type Token = {
  user_id: string;
  jwtToken: JWTStandardClaims;
};

type JWTStandardClaims = {
  aud: string; // audience
  exp: number; // expires at
  jti: string; // id
  iat: number; // IssuedAt
  iss: string; // issuer
  nbf: number; // not before
  sub: string; // subject
};
