import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

const noticeSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.NoticeSelect;

interface CreateNoticeRequest {
  title: string;
  content: string;
  authorId: number;
}

interface UpdateNoticeRequest {
  id: number;
  title?: string;
  content?: string;
}

export class NoticeService {
  async list() {
    const notices = await prisma.notice.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: noticeSelect,
    });

    return notices;
  }

  async create({ title, content, authorId }: CreateNoticeRequest) {
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        authorId,
      },
      select: noticeSelect,
    });

    return notice;
  }

  async update({ id, title, content }: UpdateNoticeRequest) {
    const data: Prisma.NoticeUpdateInput = {};

    if (title !== undefined) {
      data.title = title;
    }

    if (content !== undefined) {
      data.content = content;
    }

    const result = await prisma.notice.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });

    if (result.count === 0) {
      throw new AppError("Aviso não encontrado.", 404);
    }

    const notice = await prisma.notice.findUnique({
      where: {
        id,
      },
      select: noticeSelect,
    });

    return notice;
  }

  async remove(id: number) {
    const result = await prisma.notice.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new AppError("Aviso não encontrado.", 404);
    }
  }
}