import { Request, Response } from "express";
import { NoticeService } from "../services/NoticeService";
import { AppError } from "../errors/AppError";

export class NoticeController {
  index = async (req: Request, res: Response) => {
    const noticeService = new NoticeService();

    const notices = await noticeService.list();

    return res.json({
      notices,
    });
  };

  create = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    const { title, content } = req.body;

    const noticeService = new NoticeService();

    const notice = await noticeService.create({
      title,
      content,
      authorId: req.user.id,
    });

    return res.status(201).json({
      notice,
    });
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const noticeService = new NoticeService();

    const notice = await noticeService.update({
      id,
      title,
      content,
    });

    return res.json({
      notice,
    });
  };

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const noticeService = new NoticeService();

    await noticeService.remove(id);

    return res.status(204).send();
  };
}