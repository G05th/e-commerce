import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import buildProductRoutes from "./routes/products.js";
import buildSkusRoutes from "./routes/skus.js";

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

async function main() {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: "Catalog Service",
        description: "Catalog Service API",
        version: "0.1.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  fastify.register(buildProductRoutes(prisma));
  fastify.register(buildSkusRoutes(prisma));

  fastify.listen({ port: 3000 }, (err, adr) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server listening at ${adr}`);
  });
}

main();
