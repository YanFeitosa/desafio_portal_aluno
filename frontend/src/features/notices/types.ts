export type NoticeAuthor = {
  id: number;
  name: string;
  email: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: NoticeAuthor;
};

export type NoticeListResponse = {
  notices: Notice[];
};

export type NoticeResponse = {
  notice: Notice;
};

export type CreateNoticeRequest = {
  title: string;
  content: string;
};

export type UpdateNoticeRequest = {
  title?: string;
  content?: string;
};
