import { Router } from "express";
import { NoticeController } from "../controllers/NoticeController";
import { asyncHandler } from "../utils/asyncHandler";
import { auth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createNoticeSchema,
  updateNoticeSchema,
} from "../validators/notice.validator";
import { idParamSchema } from "../validators/common.validator";

export const noticeRoutes = Router();

const noticeController = new NoticeController();

noticeRoutes.get(
  "/",
  ...auth.authenticated,
  asyncHandler(noticeController.index)
);

noticeRoutes.post(
  "/",
  ...auth.onlyCoordinator,
  validateRequest({
    body: createNoticeSchema,
  }),
  asyncHandler(noticeController.create)
);

noticeRoutes.put(
  "/:id",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
    body: updateNoticeSchema,
  }),
  asyncHandler(noticeController.update)
);

noticeRoutes.delete(
  "/:id",
  ...auth.onlyCoordinator,
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(noticeController.remove)
);