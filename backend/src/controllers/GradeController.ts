import { Request, Response } from "express";
import { GradeService } from "../services/GradeService";

export class GradeController {
  create = async (req: Request, res: Response) => {
    const { enrollmentId, evaluationName, score } = req.body;

    const gradeService = new GradeService();

    const grade = await gradeService.create({
      enrollmentId,
      evaluationName,
      score,
    });

    return res.status(201).json({
      grade,
    });
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { evaluationName, score } = req.body;

    const gradeService = new GradeService();

    const grade = await gradeService.update({
      id,
      evaluationName,
      score,
    });

    return res.json({
      grade,
    });
  };
}