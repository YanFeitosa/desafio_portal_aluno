import { api } from "../../../lib/api";
import type { ReportCardResponse } from "../types";

export async function getMyReportCard() {
  const response = await api.get<ReportCardResponse>("/report-card/me");
  return response.data;
}

export async function getStudentReportCard(studentId: number) {
  const response = await api.get<ReportCardResponse>(
    `/report-card/students/${studentId}`
  );

  return response.data;
}