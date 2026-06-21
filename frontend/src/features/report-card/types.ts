export type ReportCardStudent = {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
};

export type ReportCardGrade = {
  id: number;
  evaluationName: string;
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type ReportCardSubjectStatus = "Sem notas" | "Aprovado" | "Reprovado";

export type ReportCardSubject = {
  id: number;
  name: string;
  grades: ReportCardGrade[];
  average: number | null;
  status: ReportCardSubjectStatus;
};

export type ReportCardResponse = {
  student: ReportCardStudent;
  subjects: ReportCardSubject[];
};