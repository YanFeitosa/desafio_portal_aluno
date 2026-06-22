import type { UserRole } from "../../types/role";

export type StudentUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type Student = {
  id: number;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
  user: StudentUser;
};

export type StudentListResponse = {
  students: Student[];
};

export type StudentResponse = {
  student: Student;
};

export type EnrollmentSubject = {
  id: number;
  name: string;
};

export type EnrollmentGrade = {
  id: number;
  evaluationName: string;
  score: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentEnrollment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  subject: EnrollmentSubject;
  grades: EnrollmentGrade[];
};

export type EnrollmentListResponse = {
  enrollments: StudentEnrollment[];
};
