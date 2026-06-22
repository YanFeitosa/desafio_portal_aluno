export type GradeStudent = {
  id: number;
  registrationNumber: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export type GradeSubject = {
  id: number;
  name: string;
};

export type Grade = {
  id: number;
  evaluationName: string;
  score: string;
  createdAt: string;
  updatedAt: string;
  enrollment: {
    id: number;
    student: GradeStudent;
    subject: GradeSubject;
  };
};

export type GradeResponse = {
  grade: Grade;
};

export type CreateGradeRequest = {
  enrollmentId: number;
  evaluationName: string;
  score: number;
};

export type UpdateGradeRequest = {
  evaluationName?: string;
  score?: number;
};

export type GradeFormValues = {
  evaluationName: string;
  score: number;
};
