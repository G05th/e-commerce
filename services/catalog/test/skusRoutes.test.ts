// test/skusRoutes.test.ts
import Fastify from "fastify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ajusta o caminho se necessário
import buildSkusRoutes from "../src/routes/skus.js";

describe("skus routes", () => {
  let fastify: ReturnType<typeof Fastify>;
  let fakePrisma: any;

  beforeEach(async () => {
    fastify = Fastify();

    // prisma fake
    fakePrisma = {
      sku: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      product: {
        findUnique: vi.fn(),
      },
    };

    // registro o plugin com o prisma injetado
    await fastify.register(buildSkusRoutes(fakePrisma));
    await fastify.ready();
  });

  afterEach(async () => {
    await fastify.close();
    vi.clearAllMocks();
  });

  it("POST /skus -> 201 returns created sku", async () => {
    const payload = {
      productId: "p1",
      sku: "SKU-01",
      attributes: { color: "red" },
      barcode: "123",
    };
    const created = {
      id: "1",
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fakePrisma.sku.create.mockResolvedValue(created);

    const res = await fastify.inject({ method: "POST", url: "/skus", payload });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body).toMatchObject({ id: "1", sku: "SKU-01", productId: "p1" });
    expect(fakePrisma.sku.create).toHaveBeenCalledWith({ data: payload });
  });

  it("GET /skus -> 200 returns list", async () => {
    const list = [
      {
        id: "1",
        productId: "p1",
        sku: "SKU-01",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        productId: "p1",
        sku: "SKU-02",
        createdAt: new Date().toISOString(),
      },
    ];
    fakePrisma.sku.findMany.mockResolvedValue(list);

    const res = await fastify.inject({ method: "GET", url: "/skus" });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(fakePrisma.sku.findMany).toHaveBeenCalled();
  });

  it("GET /skus/:id -> 404 when not found", async () => {
    fakePrisma.sku.findUnique.mockResolvedValue(null);

    const res = await fastify.inject({
      method: "GET",
      url: "/skus/nonexistent",
    });
    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload);
    expect(body).toHaveProperty("message", "sku not found");
  });

  it("GET /skus/:id -> 200 when found", async () => {
    const found = { id: "1", sku: "SKU-01", productId: "p1" };
    fakePrisma.sku.findUnique.mockResolvedValue(found);

    const res = await fastify.inject({ method: "GET", url: "/skus/1" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toMatchObject(found);
  });

  it("PUT /skus/:id -> 200 update sku", async () => {
    const id = "1";
    const data = { sku: "SKU-UPDATED" };
    const updated = {
      id,
      ...data,
      productId: "p1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fakePrisma.sku.update.mockResolvedValue(updated);

    const res = await fastify.inject({
      method: "PUT",
      url: `/skus/${id}`,
      payload: data,
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toMatchObject({ id, sku: "SKU-UPDATED" });
    expect(fakePrisma.sku.update).toHaveBeenCalledWith({ where: { id }, data });
  });

  it("DELETE /skus/:id -> 200 delete sku", async () => {
    const id = "1";
    const deleted = { id, sku: "SKU-01", productId: "p1" };
    fakePrisma.sku.delete.mockResolvedValue(deleted);

    const res = await fastify.inject({ method: "DELETE", url: `/skus/${id}` });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toMatchObject({ id });
    expect(fakePrisma.sku.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it("GET /product/:id/skus -> 200 returns product skus", async () => {
    const product = { id: "p1", name: "Product 1" };
    const skus = [{ id: "1", productId: "p1", sku: "SKU-01" }];

    fakePrisma.product.findUnique.mockResolvedValue(product);
    fakePrisma.sku.findMany.mockResolvedValue(skus);

    const res = await fastify.inject({
      method: "GET",
      url: "/product/p1/skus",
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual(skus);
    expect(fakePrisma.sku.findMany).toHaveBeenCalledWith({
      where: { productId: "p1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("GET /product/:id/skus -> 404 when product not found", async () => {
    fakePrisma.product.findUnique.mockResolvedValue(null);
    const res = await fastify.inject({
      method: "GET",
      url: "/product/doesnotexist/skus",
    });
    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.payload)).toHaveProperty(
      "message",
      "product not found",
    );
  });
});
