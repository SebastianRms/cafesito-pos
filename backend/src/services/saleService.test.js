import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";
import mongoose from "mongoose";
import { processSale } from "./saleService.js";

describe("SaleService Unit Tests", () => {
  let mockSession;

  beforeEach(() => {
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    
    // Mock de mongoose.startSession
    jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);
    
    // Espías por defecto para los modelos
    jest.spyOn(Product, "find").mockImplementation();
    jest.spyOn(Product, "bulkWrite").mockImplementation();
    jest.spyOn(Customer, "findById").mockImplementation();
    jest.spyOn(Customer, "updateOne").mockImplementation();
    jest.spyOn(Sale, "create").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Debería procesar la venta exitosamente en modo transaccional (Camino Feliz)", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Café Americano", price: 10, stock: 5 },
      { _id: "prod2", name: "Muffin", price: 20, stock: 10 }
    ];

    jest.spyOn(Product, "find").mockReturnValue({
      session: jest.fn().mockResolvedValue(mockProducts)
    });

    jest.spyOn(Product, "bulkWrite").mockResolvedValue({});

    const mockCustomer = { _id: "cust1", name: "Juan", purchases_count: 5 }; // 10% descuento
    jest.spyOn(Customer, "findById").mockReturnValue({
      session: jest.fn().mockResolvedValue(mockCustomer)
    });

    jest.spyOn(Customer, "updateOne").mockResolvedValue({});

    const mockCreatedSale = new Sale({
      _id: "sale1",
      customer_id: "cust1",
      user_id: "user1",
      items: [
        { product_id: "prod1", product_name: "Café Americano", quantity: 2, unit_price: 10, line_total: 20 },
        { product_id: "prod2", product_name: "Muffin", quantity: 1, unit_price: 20, line_total: 20 }
      ],
      subtotal: 40,
      discount_percent: 10,
      discount_amount: 4,
      total: 36,
      payment_method: "cash"
    });

    jest.spyOn(Sale, "create").mockResolvedValue([mockCreatedSale]);

    const result = await processSale({
      customer_id: "cust1",
      items: [
        { product_id: "prod1", quantity: 2 },
        { product_id: "prod2", quantity: 1 }
      ],
      user_id: "user1",
      payment_method: "cash"
    });

    expect(result).toBeDefined();
    expect(result.total).toBe(36);
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(Product.bulkWrite).toHaveBeenCalled();
    expect(Customer.updateOne).toHaveBeenCalled();
  });

  test("Debería lanzar error si el stock es insuficiente", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Café Americano", price: 10, stock: 1 }
    ];

    jest.spyOn(Product, "find").mockReturnValue({
      session: jest.fn().mockResolvedValue(mockProducts)
    });

    await expect(
      processSale({
        customer_id: null,
        items: [{ product_id: "prod1", quantity: 5 }],
        user_id: "user1",
        payment_method: "cash"
      })
    ).rejects.toThrow("Stock insuficiente");

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  test("Debería abortar la transacción y propagar error si falla la creación de la venta", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Café Americano", price: 10, stock: 5 }
    ];

    jest.spyOn(Product, "find").mockReturnValue({
      session: jest.fn().mockResolvedValue(mockProducts)
    });
    jest.spyOn(Product, "bulkWrite").mockResolvedValue({});

    jest.spyOn(Sale, "create").mockRejectedValue(new Error("Database crash"));

    await expect(
      processSale({
        customer_id: null,
        items: [{ product_id: "prod1", quantity: 1 }],
        user_id: "user1",
        payment_method: "cash"
      })
    ).rejects.toThrow("Database crash");

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  test("Debería activar fallback no transaccional si MongoDB es Standalone (sin replica set)", async () => {
    // Simular que startSession falla por falta de replica set
    jest.spyOn(mongoose, "startSession").mockRejectedValue(new Error("replica set"));

    const mockProducts = [
      { _id: "prod1", name: "Café Americano", price: 10, stock: 5 }
    ];

    jest.spyOn(Product, "find").mockResolvedValue(mockProducts);
    jest.spyOn(Product, "bulkWrite").mockResolvedValue({});

    const mockCreatedSale = new Sale({
      _id: "sale1",
      customer_id: null,
      user_id: "user1",
      subtotal: 10,
      discount_percent: 0,
      discount_amount: 0,
      total: 10,
      payment_method: "cash"
    });

    jest.spyOn(Sale, "create").mockResolvedValue(mockCreatedSale);

    const result = await processSale({
      customer_id: null,
      items: [{ product_id: "prod1", quantity: 1 }],
      user_id: "user1",
      payment_method: "cash"
    });

    expect(result).toBeDefined();
    expect(result.total).toBe(10);
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    expect(Product.bulkWrite).toHaveBeenCalled();
    expect(Sale.create).toHaveBeenCalled();
  });
});
