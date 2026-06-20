import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { ReportCardService } from "../services/ReportCardService";

export class ReportCardController {
  showMyReportCard = async (req: Request, res: Response) => {
    if (!req.user?.studentId) {
      throw new AppError("Aluno não encontrado.", 404);
    }

    const reportCardService = new ReportCardService();

    const reportCard = await reportCardService.getStudentReportCard(
      req.user.studentId
    );

    return res.json(reportCard);
  };

  showStudentReportCard = async (req: Request, res: Response) => {
    const studentId = Number(req.params.id);

    const reportCardService = new ReportCardService();

    const reportCard = await reportCardService.getStudentReportCard(studentId);

    return res.json(reportCard);
  };
}