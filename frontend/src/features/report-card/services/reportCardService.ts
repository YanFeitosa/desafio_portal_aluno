import { api } from "../../../lib/api";
import type { ReportCardResponse } from "../types";

export async function getMyReportCard(): Promise<ReportCardResponse> {
  const response = await api.get<ReportCardResponse>("/report-card/me");

  return response.data;
}
