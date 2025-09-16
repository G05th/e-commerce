import { PrismaClient } from "@prisma/client";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export default function buildSkusRoutes(prisma: PrismaClient) {
  return async function skusRoutes(
    fastify: FastifyInstance,
    _opts?: FastifyPluginOptions,
  ) {
    fastify.post(
      "/skus",
      {
        schema: {
          body: {
            type: "object",
            required: ["productId", "sku"],
            properties: {
              productId: { type: "string" },
              sku: { type: "string" },
              attributes: { type: ["object", "null"] },
              barcode: { type: "string" },
            },
          },
          response: {
            201: {
              type: "object",
              properties: {
                id: { type: "string" },
                productId: { type: "string" },
                sku: { type: "string" },
                attributes: { type: "string" },
                barcode: { type: "string" },
              },
            },
          },
        },
      },
      async (request, replay) => {
        const sku = await prisma.sku.create({
          data: request.body as any,
        });
        replay.code(201).send(sku);
      },
    );

    fastify.get("/skus", async (request, replay) => {
      const skus = await prisma.sku.findMany({
        orderBy: { createdAt: "desc" },
      });

      return replay.code(200).send(skus);
    });

    fastify.get(
      "/skus/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
        },
      },
      async (request, replay) => {
        const { id } = request.params as any;
        const skus = await prisma.sku.findUnique({ where: { id } });
        if (!skus) return replay.code(404).send({ message: "sku not found" });
        return replay.code(200).send(skus);
      },
    );

    fastify.put(
      "/skus/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: {
              id: { type: "string" },
            },
          },
          body: {
            type: "object",
            properties: {
              productId: { type: "string" },
              sku: { type: "string" },
              attributes: { type: ["object", "null"] },
              barcode: { type: "string" },
            },
          },
        },
      },
      async (request, replay) => {
        const { id } = request.params as any;
        const data = request.body as any;
        try {
          const sku = await prisma.sku.update({
            where: { id },
            data,
          });
          return sku;
        } catch {
          replay.code(404).send({ message: "sku not found" });
        }
      },
    );

    fastify.delete(
      "/skus/:id",
      {
        schema: {
          params: {
            type: "object",
            required: ["id"],
            properties: { id: { type: "string" } },
          },
        },
      },
      async (request, replay) => {
        const { id } = request.params as any;
        try {
          const skus = await prisma.sku.delete({ where: { id } });
          return skus;
        } catch {
          return replay.code(404).send({ message: "sku not found" });
        }
      },
    );

    fastify.get(
      "/product/:id/skus",
      {
        schema: {
          params: {
            required: ["id"],
            properties: { id: { type: "string" } },
          },
        },
      },
      async (request, replay) => {
        const { id } = request.params as any;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product)
          return replay.code(404).send({ message: "product not found" });

        const skus = await prisma.sku.findMany({
          where: { productId: id },
          orderBy: { createdAt: "desc" },
        });
        return skus;
      },
    );
  };
}
