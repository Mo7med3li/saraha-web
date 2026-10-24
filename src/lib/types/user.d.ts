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
  deletedAt?: Date | string | null;
  deletedBy?: string | null;
  restoredAt?: Date | string | null;
  restoredBy?: string | null;
}

declare interface IMessage {
  _id: string;
  content: string;
  attachments: {
    imageUrl: string;
    asset_id: string;
    _id: string;
    id: string;
  }[];
  senderId?: string | null;
  sender?: Pick<IUser, "_id" | "userName" | "profileImage"> | null;
  receiverId: string;
  parentMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface IUserMessages {
  messages: IMessage[];
}
