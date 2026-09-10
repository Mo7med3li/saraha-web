declare interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
