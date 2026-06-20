export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Portal do Aluno API",
    version: "1.0.0",
    description:
      "Documentação resumida da API do Portal do Aluno. As rotas protegidas utilizam JWT Bearer Token.",
  },
  servers: [
    {
      url: "http://localhost:3333",
      description: "Ambiente local",
    },
  ],
  tags: [
    { name: "Auth", description: "Autenticação" },
    { name: "Notices", description: "Avisos institucionais" },
    { name: "Students", description: "Alunos e matrículas" },
    { name: "Subjects", description: "Disciplinas" },
    { name: "Grades", description: "Notas" },
    { name: "Report Card", description: "Boletim acadêmico" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            example: "coord@escola.com",
          },
          password: {
            type: "string",
            example: "123456",
          },
        },
      },

      NoticeCreateRequest: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: {
            type: "string",
            example: "Calendário de avaliações",
          },
          content: {
            type: "string",
            example: "As próximas avaliações serão divulgadas pela coordenação.",
          },
        },
      },

      NoticeUpdateRequest: {
        type: "object",
        description: "Envie pelo menos um campo.",
        properties: {
          title: {
            type: "string",
            example: "Aviso atualizado",
          },
          content: {
            type: "string",
            example: "Conteúdo atualizado.",
          },
        },
      },

      GradeCreateRequest: {
        type: "object",
        required: ["enrollmentId", "evaluationName", "score"],
        properties: {
          enrollmentId: {
            type: "integer",
            example: 1,
          },
          evaluationName: {
            type: "string",
            example: "Prova 1",
          },
          score: {
            type: "number",
            minimum: 0,
            maximum: 10,
            example: 8.5,
          },
        },
      },

      GradeUpdateRequest: {
        type: "object",
        description: "Envie pelo menos um campo.",
        properties: {
          evaluationName: {
            type: "string",
            example: "Prova Final",
          },
          score: {
            type: "number",
            minimum: 0,
            maximum: 10,
            example: 9,
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Acesso não autorizado.",
          },
        },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description:
          "Autentica usuário por e-mail e senha.\n\n**Perfis:** Coordenação e Aluno.",
        "x-roles": ["COORDINATOR", "STUDENT"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login realizado com sucesso.",
          },
          "400": {
            description: "Dados inválidos.",
          },
          "401": {
            description: "Credenciais inválidas.",
          },
          "429": {
            description: "Muitas tentativas de login.",
          },
        },
      },
    },

    "/auth/me": {
  get: {
    tags: ["Auth"],
    summary: "Usuário autenticado",
    description:
      "Retorna os dados básicos do usuário autenticado.\n\n**Perfis:** Coordenação e Aluno.",
    security: [{ bearerAuth: [] }],
    "x-roles": ["COORDINATOR", "STUDENT"],
    responses: {
      "200": {
        description: "Usuário autenticado.",
      },
      "401": {
        description: "Token ausente, inválido ou expirado.",
      },
    },
  },
},

    "/notices": {
      get: {
        tags: ["Notices"],
        summary: "Listar avisos",
        description:
          "Lista avisos ativos em ordem decrescente de criação.\n\n**Perfis:** Coordenação e Aluno.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR", "STUDENT"],
        responses: {
          "200": {
            description: "Avisos listados com sucesso.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
        },
      },

      post: {
        tags: ["Notices"],
        summary: "Criar aviso",
        description:
          "Cria um aviso no mural institucional.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NoticeCreateRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Aviso criado com sucesso.",
          },
          "400": {
            description: "Dados inválidos.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
        },
      },
    },

    "/notices/{id}": {
      put: {
        tags: ["Notices"],
        summary: "Atualizar aviso",
        description:
          "Atualiza um aviso ativo.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NoticeUpdateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Aviso atualizado com sucesso.",
          },
          "400": {
            description: "Dados inválidos.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aviso não encontrado.",
          },
        },
      },

      delete: {
        tags: ["Notices"],
        summary: "Remover aviso",
        description:
          "Realiza soft delete de um aviso.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Aviso removido com sucesso.",
          },
          "400": {
            description: "ID inválido.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aviso não encontrado.",
          },
        },
      },
    },

    "/students": {
      get: {
        tags: ["Students"],
        summary: "Listar alunos",
        description:
          "Lista alunos ativos.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        responses: {
          "200": {
            description: "Alunos listados com sucesso.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
        },
      },
    },

    "/students/{id}": {
      get: {
        tags: ["Students"],
        summary: "Buscar aluno por ID",
        description:
          "Consulta um aluno específico.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Aluno encontrado.",
          },
          "400": {
            description: "ID inválido.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aluno não encontrado.",
          },
        },
      },
    },

    "/students/{id}/enrollments": {
      get: {
        tags: ["Students"],
        summary: "Listar matrículas do aluno",
        description:
          "Lista as disciplinas cursadas pelo aluno e suas notas.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Matrículas listadas com sucesso.",
          },
          "400": {
            description: "ID inválido.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aluno não encontrado.",
          },
        },
      },
    },

    "/subjects": {
      get: {
        tags: ["Subjects"],
        summary: "Listar disciplinas",
        description:
          "Lista disciplinas ativas.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        responses: {
          "200": {
            description: "Disciplinas listadas com sucesso.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
        },
      },
    },

    "/grades": {
      post: {
        tags: ["Grades"],
        summary: "Lançar nota",
        description:
          "Cria uma nota vinculada a uma matrícula.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GradeCreateRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Nota criada com sucesso.",
          },
          "400": {
            description: "Dados inválidos.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Matrícula não encontrada.",
          },
        },
      },
    },

    "/grades/{id}": {
      put: {
        tags: ["Grades"],
        summary: "Atualizar nota",
        description:
          "Atualiza uma nota existente.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GradeUpdateRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Nota atualizada com sucesso.",
          },
          "400": {
            description: "Dados inválidos.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Nota não encontrada.",
          },
        },
      },
    },

    "/report-card/me": {
      get: {
        tags: ["Report Card"],
        summary: "Meu boletim",
        description:
          "Retorna o boletim do aluno autenticado, com notas agrupadas por disciplina, média e status.\n\n**Perfil:** Aluno.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["STUDENT"],
        responses: {
          "200": {
            description: "Boletim retornado com sucesso.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aluno não encontrado.",
          },
        },
      },
    },

    "/report-card/students/{id}": {
      get: {
        tags: ["Report Card"],
        summary: "Boletim de aluno",
        description:
          "Retorna o boletim de um aluno específico.\n\n**Perfil:** Coordenação.",
        security: [{ bearerAuth: [] }],
        "x-roles": ["COORDINATOR"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Boletim retornado com sucesso.",
          },
          "400": {
            description: "ID inválido.",
          },
          "401": {
            description: "Token ausente, inválido ou expirado.",
          },
          "403": {
            description: "Acesso não autorizado.",
          },
          "404": {
            description: "Aluno não encontrado.",
          },
        },
      },
    },
  },
};