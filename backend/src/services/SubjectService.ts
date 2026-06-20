import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const subjectSelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubjectSelect;

export class SubjectService {
  async list() {
    const subjects = await prisma.subject.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      select: subjectSelect,
    });

    return subjects;
  }
}