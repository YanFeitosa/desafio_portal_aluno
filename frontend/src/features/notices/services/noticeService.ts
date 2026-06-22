import { api } from "../../../lib/api";
import type {
  CreateNoticeRequest,
  Notice,
  NoticeListResponse,
  NoticeResponse,
  UpdateNoticeRequest,
} from "../types";

export async function listNotices(): Promise<Notice[]> {
  const response = await api.get<NoticeListResponse>("/notices");

  return response.data.notices;
}

export async function createNotice(
  data: CreateNoticeRequest
): Promise<Notice> {
  const response = await api.post<NoticeResponse>("/notices", data);

  return response.data.notice;
}

export async function updateNotice(
  id: number,
  data: UpdateNoticeRequest
): Promise<Notice> {
  const response = await api.put<NoticeResponse>(`/notices/${id}`, data);

  return response.data.notice;
}

export async function deleteNotice(id: number): Promise<void> {
  await api.delete(`/notices/${id}`);
}
