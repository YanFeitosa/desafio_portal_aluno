import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import {
  calculateAcademicStatus,
  calculateAverage,
} from "../utils/reportCardTools";

const enrollmentWithGradesSelect = {
  id: true,
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
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      evaluationName: true,
      score: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.EnrollmentSelect;

export class ReportCardService {
  async getStudentReportCard(studentId: number) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        user: {
          deletedAt: null,
        },
      },
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
      select: enrollmentWithGradesSelect,
    });

    const subjects = enrollments.map((enrollment) => {
      const grades = enrollment.grades.map((grade) => ({
        id: grade.id,
        evaluationName: grade.evaluationName,
        score: Number(grade.score),
        createdAt: grade.createdAt,
        updatedAt: grade.updatedAt,
      }));

      const scores = grades.map((grade) => grade.score);
      const average = calculateAverage(scores);
      const status = calculateAcademicStatus(average);

      return {
        id: enrollment.subject.id,
        name: enrollment.subject.name,
        grades,
        average,
        status,
      };
    });

    return {
      student: {
        id: student.id,
        name: student.user.name,
        email: student.user.email,
        registrationNumber: student.registrationNumber,
      },
      subjects,
    };
  }
}