import { Request, Response } from "express";
import { StudentService } from "../services/StudentService";

export class StudentController {
  index = async (req: Request, res: Response) => {
    const studentService = new StudentService();

    const students = await studentService.list();

    return res.json({
      students,
    });
  };

  show = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const studentService = new StudentService();

    const student = await studentService.findById(id);

    return res.json({
      student,
    });
  };

  enrollments = async (req: Request, res: Response) => {
    const studentId = Number(req.params.id);

    const studentService = new StudentService();

    const enrollments = await studentService.listEnrollments(studentId);

    return res.json({
      enrollments,
    });
  };
}