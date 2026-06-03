import swaggerJSDoc from "swagger-jsdoc";

/**
 * swagger-jsdoc reads the @openapi JSDoc annotations in the route files and
 * builds the OpenAPI spec served at /api/swagger.json and rendered at /api/docs.
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MovieReel REST API",
      version: "1.0.0",
      description:
        "REST API for the MovieReel platform (Web Programming 2026, Part 3). " +
        "Auth uses JWT Bearer tokens; admin-only routes are marked accordingly.",
    },
    servers: [{ url: "/", description: "Current host" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
  },
  // scan routes (and models) for annotations
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
