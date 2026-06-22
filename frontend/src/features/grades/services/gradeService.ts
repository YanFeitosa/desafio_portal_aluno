import { api } from "../../../lib/api";
import type {
  CreateGradeRequest,
  Grade,
  GradeResponse,
  UpdateGradeRequest,
} from "../types";

export async function createGrade(data: CreateGradeRequest): Promise<Grade> {
  const response = await api.post<GradeResponse>("/grades", data);

  return response.data.grade;
}

export async function updateGrade(
  id: number,
  data: UpdateGradeRequest
): Promise<Grade> {
  const response = await api.put<GradeResponse>(`/grades/${id}`, data);

  return response.data.grade;
}
