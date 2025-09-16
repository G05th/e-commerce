// test/productRoutes.test.ts
import Fastify from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import buildProductRoutes from "../src/routes/products";

describe("productRoutes (with injected prisma)", () => {
  let fastify: ReturnType<typeof Fastify>;
  let fakePrisma: any;

  beforeEach(async () => {
    fastify = Fastify();
    // cria um prisma "fake" com métodos mockados
    fakePrisma = {
      product: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    await fastify.register(buildProductRoutes(fakePrisma));
    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
    vi.clearAllMocks();
  });

  it("POST /products -> 201", async () => {
    const payload = { name: "p", slug: "p" };
    const created = {
      id: "1",
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fakePrisma.product.create.mockResolvedValue(created);

    const res = await fastify.inject({
      method: "POST",
      url: "/products",
      payload,
    });
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.payload)).toMatchObject({ id: "1" });
    expect(fakePrisma.product.create).toHaveBeenCalled();
  });

  it("GET /products -> 200 list", async () => {
    const list = [
      { id: "1", name: "a", slug: "a", createdAt: new Date().toISOString() },
    ];
    fakePrisma.product.findMany.mockResolvedValue(list);

    const res = await fastify.inject({ method: "GET", url: "/products" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual(list);
    expect(fakePrisma.product.findMany).toHaveBeenCalled();
  });

  it("GET /products/:id -> not found -> 404", async () => {
    fakePrisma.product.findUnique.mockResolvedValue(null);
    const res = await fastify.inject({
      method: "GET",
      url: "/products/does-not-exist",
    });
    expect(res.statusCode).toBe(404);
  });

  it("PUT /products/:id -> update", async () => {
    const id = "1";
    const updated = {
      id,
      name: "updated",
      slug: "slug",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    fakePrisma.product.update.mockResolvedValue(updated);

    const res = await fastify.inject({
      method: "PUT",
      url: `/products/${id}`,
      payload: { name: "updated" },
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toMatchObject({ id });
    expect(fakePrisma.product.update).toHaveBeenCalled();
  });

  it("DELETE /product/:id -> delete", async () => {
    const id = "1";
    const deleted = { id, name: "x", slug: "x" };
    fakePrisma.product.delete.mockResolvedValue(deleted);

    const res = await fastify.inject({
      method: "DELETE",
      url: `/product/${id}`,
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toMatchObject({ id });
    expect(fakePrisma.product.delete).toHaveBeenCalled();
  });
});
