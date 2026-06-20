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