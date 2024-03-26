export interface ITokenModel {
  success: boolean;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ILoginModel {
  login: ITokenModel;
  setLogin: any;
}

export interface IRefreshModel {
  exp: number;
  jti: string;
  sub: string;
  token_type: string;
}
