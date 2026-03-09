export interface IGoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export interface IFacebookUserInfo {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      url: string;
    };
  };
}
