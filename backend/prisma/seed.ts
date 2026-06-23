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

  const studentDefinitions = [
    {
      name: "João Silva",
      email: "aluno@escola.com",
      registrationNumber: "2026001",
    },
    {
      name: "Maria Oliveira",
      email: "maria@escola.com",
      registrationNumber: "2026002",
    },
    {
      name: "Carla Santos",
      email: "carla@escola.com",
      registrationNumber: "2026003",
    },
    {
      name: "Pedro Lima",
      email: "pedro@escola.com",
      registrationNumber: "2026004",
    },
    {
      name: "Ana Costa",
      email: "ana@escola.com",
      registrationNumber: "2026005",
    },
  ];

  const students = await Promise.all(
    studentDefinitions.map((student) =>
      prisma.user.create({
        data: {
          name: student.name,
          email: student.email,
          passwordHash,
          role: UserRole.STUDENT,
          student: {
            create: {
              registrationNumber: student.registrationNumber,
            },
          },
        },
        include: {
          student: true,
        },
      })
    )
  );

  if (students.some((student) => !student.student)) {
    throw new Error("Alunos não criados corretamente.");
  }

  const [joao, maria, carla, pedro, ana] = students;

  const subjectDefinitions = [
    "Matemática",
    "Português",
    "História",
    "Ciências",
    "Geografia",
    "Inglês",
  ];

  const subjects = await Promise.all(
    subjectDefinitions.map((name) =>
      prisma.subject.create({
        data: {
          name,
        },
      })
    )
  );

  const [matematica, portugues, historia, ciencias, geografia, ingles] =
    subjects;

  const enrollmentDefinitions = [
    { key: "joaoMatematica", student: joao.student!, subject: matematica },
    { key: "joaoPortugues", student: joao.student!, subject: portugues },
    { key: "joaoCiencias", student: joao.student!, subject: ciencias },
    { key: "mariaMatematica", student: maria.student!, subject: matematica },
    { key: "mariaHistoria", student: maria.student!, subject: historia },
    { key: "mariaGeografia", student: maria.student!, subject: geografia },
    { key: "carlaPortugues", student: carla.student!, subject: portugues },
    { key: "carlaIngles", student: carla.student!, subject: ingles },
    { key: "carlaHistoria", student: carla.student!, subject: historia },
    { key: "pedroMatematica", student: pedro.student!, subject: matematica },
    { key: "pedroCiencias", student: pedro.student!, subject: ciencias },
    { key: "pedroIngles", student: pedro.student!, subject: ingles },
    { key: "anaGeografia", student: ana.student!, subject: geografia },
    { key: "anaPortugues", student: ana.student!, subject: portugues },
    { key: "anaCiencias", student: ana.student!, subject: ciencias },
  ];

  const enrollments = await Promise.all(
    enrollmentDefinitions.map((enrollment) =>
      prisma.enrollment.create({
        data: {
          studentId: enrollment.student.id,
          subjectId: enrollment.subject.id,
        },
      })
    )
  );

  const enrollmentByKey = Object.fromEntries(
    enrollmentDefinitions.map((enrollment, index) => [
      enrollment.key,
      enrollments[index],
    ])
  ) as Record<string, { id: number }>;

  const gradeDefinitions = [
    {
      enrollmentKey: "joaoMatematica",
      grades: [
        { evaluationName: "Prova 1", score: 8.5 },
        { evaluationName: "Prova 2", score: 7.0 },
        { evaluationName: "Trabalho", score: 9.0 },
      ],
    },
    {
      enrollmentKey: "joaoPortugues",
      grades: [
        { evaluationName: "Prova 1", score: 6.0 },
        { evaluationName: "Prova 2", score: 5.5 },
        { evaluationName: "Seminário", score: 7.0 },
      ],
    },
    {
      enrollmentKey: "joaoCiencias",
      grades: [
        { evaluationName: "Experimento", score: 8.0 },
        { evaluationName: "Prova 1", score: 7.5 },
      ],
    },
    {
      enrollmentKey: "mariaMatematica",
      grades: [
        { evaluationName: "Prova 1", score: 9.0 },
        { evaluationName: "Prova 2", score: 8.0 },
        { evaluationName: "Lista de exercícios", score: 9.5 },
      ],
    },
    {
      enrollmentKey: "mariaHistoria",
      grades: [
        { evaluationName: "Prova 1", score: 6.5 },
        { evaluationName: "Prova 2", score: 7.5 },
      ],
    },
    {
      enrollmentKey: "mariaGeografia",
      grades: [
        { evaluationName: "Mapa temático", score: 8.0 },
        { evaluationName: "Prova 1", score: 7.0 },
      ],
    },
    {
      enrollmentKey: "carlaPortugues",
      grades: [
        { evaluationName: "Redação", score: 8.0 },
        { evaluationName: "Prova 1", score: 7.5 },
      ],
    },
    {
      enrollmentKey: "carlaIngles",
      grades: [
        { evaluationName: "Oral test", score: 9.0 },
        { evaluationName: "Writing", score: 8.5 },
      ],
    },
    {
      enrollmentKey: "carlaHistoria",
      grades: [
        { evaluationName: "Prova 1", score: 7.0 },
        { evaluationName: "Pesquisa", score: 8.0 },
      ],
    },
    {
      enrollmentKey: "pedroMatematica",
      grades: [
        { evaluationName: "Prova 1", score: 5.0 },
        { evaluationName: "Prova 2", score: 6.0 },
        { evaluationName: "Recuperação parcial", score: 6.5 },
      ],
    },
    {
      enrollmentKey: "pedroCiencias",
      grades: [
        { evaluationName: "Relatório", score: 6.0 },
        { evaluationName: "Prova 1", score: 6.5 },
      ],
    },
    {
      enrollmentKey: "pedroIngles",
      grades: [
        { evaluationName: "Listening", score: 7.0 },
        { evaluationName: "Writing", score: 6.5 },
      ],
    },
    {
      enrollmentKey: "anaGeografia",
      grades: [
        { evaluationName: "Prova 1", score: 9.0 },
        { evaluationName: "Mapa temático", score: 8.5 },
      ],
    },
    {
      enrollmentKey: "anaPortugues",
      grades: [
        { evaluationName: "Redação", score: 9.0 },
        { evaluationName: "Prova 1", score: 8.0 },
      ],
    },
    {
      enrollmentKey: "anaCiencias",
      grades: [
        { evaluationName: "Experimento", score: 8.5 },
        { evaluationName: "Prova 1", score: 8.0 },
      ],
    },
  ];

  await prisma.grade.createMany({
    data: gradeDefinitions.flatMap(({ enrollmentKey, grades }) =>
      grades.map((grade) => ({
        enrollmentId: enrollmentByKey[enrollmentKey].id,
        evaluationName: grade.evaluationName,
        score: grade.score,
      }))
    ),
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
      {
        title: "Entrega de trabalhos",
        content:
          "Os trabalhos avaliativos devem ser entregues ao professor responsável de cada disciplina.",
        authorId: coordinator.id,
      },
      {
        title: "Atendimento da coordenação",
        content:
          "A coordenação estará disponível para atendimento aos responsáveis das 14h às 17h.",
        authorId: coordinator.id,
      },
      {
        title: "Simulado interdisciplinar",
        content:
          "O simulado interdisciplinar ocorrerá na sexta-feira e envolverá todas as turmas cadastradas.",
        authorId: coordinator.id,
      },
    ],
  });

  console.log("Seed executado com sucesso!");
  console.log("");
  console.log("Usuários para teste:");
  console.log("Coordenação: coord@escola.com / 123456");
  for (const student of studentDefinitions) {
    console.log(`${student.name}: ${student.email} / 123456`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
