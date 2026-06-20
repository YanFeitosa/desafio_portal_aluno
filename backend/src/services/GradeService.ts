import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

const gradeSelect = {
  id: true,
  evaluationName: true,
  score: true,
  createdAt: true,
  updatedAt: true,
  enrollment: {
    select: {
      id: true,
      student: {
        select: {
          id: true,
          registrationNumber: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.GradeSelect;

interface CreateGradeRequest {
  enrollmentId: number;
  evaluationName: string;
  score: number;
}

interface UpdateGradeRequest {
  id: number;
  evaluationName?: string;
  score?: number;
}

export class GradeService {
  async create({ enrollmentId, evaluationName, score }: CreateGradeRequest) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        deletedAt: null,
        student: {
          user: {
            deletedAt: null,
          },
        },
        subject: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      throw new AppError("Matrícula não encontrada.", 404);
    }

    const grade = await prisma.grade.create({
      data: {
        enrollmentId,
        evaluationName,
        score,
      },
      select: gradeSelect,
    });

    return grade;
  }

  async update({ id, evaluationName, score }: UpdateGradeRequest) {
    const gradeExists = await prisma.grade.findFirst({
      where: {
        id,
        deletedAt: null,
        enrollment: {
          deletedAt: null,
          student: {
            user: {
              deletedAt: null,
            },
          },
          subject: {
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!gradeExists) {
      throw new AppError("Nota não encontrada.", 404);
    }

    const data: Prisma.GradeUpdateInput = {};

    if (evaluationName !== undefined) {
      data.evaluationName = evaluationName;
    }

    if (score !== undefined) {
      data.score = score;
    }

    const grade = await prisma.grade.update({
      where: {
        id,
      },
      data,
      select: gradeSelect,
    });

    return grade;
  }
}