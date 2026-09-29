declare interface IUser {
  _id: string;
  userName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  confirmEmail: Date;
  providers: string;
  profileImage: {
    imageUrl: string;
    asset_id: string;
  };
  profileGallery: {
    imageUrl: string;
    asset_id: string;
  }[];
  role: string;
  createdAt: Date;
}
