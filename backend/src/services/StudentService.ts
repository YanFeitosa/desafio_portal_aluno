import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

const studentSelect = {
  id: true,
  registrationNumber: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.StudentSelect;

const enrollmentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  subject: {
    select: {
      id: true,
      name: true,
    },
  },
  grades: {
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      evaluationName: true,
      score: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.EnrollmentSelect;

export class StudentService {
  async list() {
    const students = await prisma.student.findMany({
      where: {
        user: {
          deletedAt: null,
        },
      },
      orderBy: {
        id: "asc",
      },
      select: studentSelect,
    });

    return students;
  }

  async findById(id: number) {
    const student = await prisma.student.findFirst({
      where: {
        id,
        user: {
          deletedAt: null,
        },
      },
      select: studentSelect,
    });

    if (!student) {
      throw new AppError("Aluno não encontrado.", 404);
    }

    return student;
  }

  async listEnrollments(studentId: number) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        user: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (!student) {
      throw new AppError("Aluno não encontrado.", 404);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
        deletedAt: null,
        subject: {
          deletedAt: null,
        },
      },
      orderBy: {
        subject: {
          name: "asc",
        },
      },
      select: enrollmentSelect,
    });

    return enrollments;
  }
}