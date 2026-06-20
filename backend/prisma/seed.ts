import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma";

if (process.env.NODE_ENV === "production") {
  throw new Error("Seed bloqueado em produção porque remove dados existentes.");
}

async function main() {
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.student.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  const coordinator = await prisma.user.create({
    data: {
      name: "Coordenação Escolar",
      email: "coord@escola.com",
      passwordHash,
      role: UserRole.COORDINATOR,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: "João Silva",
      email: "aluno@escola.com",
      passwordHash,
      role: UserRole.STUDENT,
      student: {
        create: {
          registrationNumber: "2026001",
        },
      },
    },
    include: {
      student: true,
    },
  });

  const secondStudentUser = await prisma.user.create({
    data: {
      name: "Maria Oliveira",
      email: "maria@escola.com",
      passwordHash,
      role: UserRole.STUDENT,
      student: {
        create: {
          registrationNumber: "2026002",
        },
      },
    },
    include: {
      student: true,
    },
  });

  const matematica = await prisma.subject.create({
    data: {
      name: "Matemática",
    },
  });

  const portugues = await prisma.subject.create({
    data: {
      name: "Português",
    },
  });

  const historia = await prisma.subject.create({
    data: {
      name: "História",
    },
  });

  if (!studentUser.student || !secondStudentUser.student) {
    throw new Error("Alunos não criados corretamente.");
  }

  const joaoMatematica = await prisma.enrollment.create({
    data: {
      studentId: studentUser.student.id,
      subjectId: matematica.id,
    },
  });

  const joaoPortugues = await prisma.enrollment.create({
    data: {
      studentId: studentUser.student.id,
      subjectId: portugues.id,
    },
  });

  const mariaMatematica = await prisma.enrollment.create({
    data: {
      studentId: secondStudentUser.student.id,
      subjectId: matematica.id,
    },
  });

  const mariaHistoria = await prisma.enrollment.create({
    data: {
      studentId: secondStudentUser.student.id,
      subjectId: historia.id,
    },
  });

  await prisma.grade.createMany({
    data: [
      {
        enrollmentId: joaoMatematica.id,
        evaluationName: "Prova 1",
        score: 8.5,
      },
      {
        enrollmentId: joaoMatematica.id,
        evaluationName: "Prova 2",
        score: 7.0,
      },
      {
        enrollmentId: joaoPortugues.id,
        evaluationName: "Prova 1",
        score: 6.0,
      },
      {
        enrollmentId: joaoPortugues.id,
        evaluationName: "Prova 2",
        score: 5.5,
      },
      {
        enrollmentId: mariaMatematica.id,
        evaluationName: "Prova 1",
        score: 9.0,
      },
      {
        enrollmentId: mariaMatematica.id,
        evaluationName: "Prova 2",
        score: 8.0,
      },
      {
        enrollmentId: mariaHistoria.id,
        evaluationName: "Prova 1",
        score: 6.5,
      },
      {
        enrollmentId: mariaHistoria.id,
        evaluationName: "Prova 2",
        score: 7.5,
      },
    ],
  });

  await prisma.notice.createMany({
    data: [
      {
        title: "Boas-vindas ao Portal do Aluno",
        content:
          "Este é o novo portal acadêmico para consulta de avisos e boletim.",
        authorId: coordinator.id,
      },
      {
        title: "Calendário de avaliações",
        content: "As próximas avaliações serão divulgadas pela coordenação.",
        authorId: coordinator.id,
      },
      {
        title: "Reunião pedagógica",
        content:
          "A coordenação informa que haverá reunião pedagógica na próxima semana.",
        authorId: coordinator.id,
      },
    ],
  });

  console.log("Seed executado com sucesso!");
  console.log("");
  console.log("Usuários para teste:");
  console.log("Coordenação: coord@escola.com / 123456");
  console.log("Aluno João: aluno@escola.com / 123456");
  console.log("Aluno Maria: maria@escola.com / 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });