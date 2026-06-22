import { api } from "../../../lib/api";
import type {
  EnrollmentListResponse,
  Student,
  StudentEnrollment,
  StudentListResponse,
  StudentResponse,
} from "../types";

export async function listStudents(): Promise<Student[]> {
  const response = await api.get<StudentListResponse>("/students");

  return response.data.students;
}

export async function getStudent(id: number): Promise<Student> {
  const response = await api.get<StudentResponse>(`/students/${id}`);

  return response.data.student;
}

export async function listStudentEnrollments(
  studentId: number
): Promise<StudentEnrollment[]> {
  const response = await api.get<EnrollmentListResponse>(
    `/students/${studentId}/enrollments`
  );

  return response.data.enrollments;
}
