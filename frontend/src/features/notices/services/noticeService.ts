import { api } from "../../../lib/api";
import type { Notice, NoticeListResponse } from "../types";

export async function listNotices(): Promise<Notice[]> {
  const response = await api.get<NoticeListResponse>("/notices");

  return response.data.notices;
}