import type { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function buildProductRoutes(prisma: PrismaClient) {
  return async function productRoutes(
    fastify: FastifyInstance,
    _opts?: FastifyPluginOptions,
  ) {
    // Create Product
    fastify.post(
      "/products",
      {
        schema: {
          body: {
            type: "object",
            required: ["name", "slug"],
            properties: {
              name: { type: "string" },
              slug: { type: "string" },
              shortDescription: { type: "string" },
              longDescription: { type: "string" },
              defaultImage: { type: "string" },
              status: {
                type: "string",
                enum: ["draft", "published", "archived"],
              },
              metadata: { type: ["object", "null"] },
            },
          },
          response: {
            201: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                slug: { type: "string" },
                shortDescription: { type: "string" },
                longDescription: { type: "string" },
                defaultImage: { type: "string" },
                status: { type: "string" },
                metadata: { type: ["object", "null"] },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
        },
      },
      async (request, reply) => {
        const product = await prisma.product.create({
          data: request.body as any,
        });
        reply.code(201).send(product);
      },
    );

    // Get All Products
    fastify.get("/products", async () => {
      const listProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      return listProducts;
    });

    // Get Product by ID
    fastify.get(
      "/products/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as any;
        const getProductById = await prisma.product.findUnique({
          where: { id },
        });
        if (!getProductById)
          return reply.code(404).send({ message: "product not found" });
        return getProductById;
      },
    );

    // Update Product
    fastify.put(
      "/products/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
          },
          body: {
            type: "object",
            properties: {
              name: { type: "string" },
              slug: { type: "string" },
              shortDescription: { type: "string" },
              longDescription: { type: "string" },
              defaultImage: { type: "string" },
              status: {
                type: "string",
                enum: ["draft", "published", "archived"],
              },
              metadata: { type: ["object", "null"] },
            },
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as any;
        const data = request.body as any;
        try {
          const product = await prisma.product.update({ where: { id }, data });
          return product;
        } catch {
          return reply.code(404).send({ message: "product not found" });
        }
      },
    );

    // Delete Product
    fastify.delete(
      "/product/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params as any;
        try {
          const product = await prisma.product.delete({ where: { id } });
          return product;
        } catch {
          return reply.code(404).send({ message: "product not found" });
        }
      },
    );
  };
}
