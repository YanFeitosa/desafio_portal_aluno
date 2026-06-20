import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService";

export class SubjectController {
  index = async (req: Request, res: Response) => {
    const subjectService = new SubjectService();

    const subjects = await subjectService.list();

    return res.json({
      subjects,
    });
  };
}