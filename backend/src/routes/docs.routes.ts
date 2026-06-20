import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../docs/swagger";

export const docsRoutes = Router();

docsRoutes.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "Portal do Aluno API",
    swaggerOptions: {
      supportedSubmitMethods: [],
    },
  })
);

docsRoutes.get("/json", (_req, res) => {
  return res.json(swaggerDocument);
});