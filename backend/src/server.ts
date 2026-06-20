import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  return res.json({
    message: "Portal do Aluno API funcionando",
  });
});

app.use(routes);

app.use(errorHandler);

const BASE_URL = `http://localhost:${env.PORT}`;

async function bootstrap() {
  try {
    await prisma.$connect();

    app.listen(env.PORT, () => {
      console.log(`Server running at ${BASE_URL}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor.");

    if (error instanceof Error) {
      console.error(error.message);
    }

    await prisma.$disconnect();

    process.exit(1);
  }
}

bootstrap();