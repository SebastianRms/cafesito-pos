import { TestBed } from '@angular/core/testing';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartStore]
    });
    store = TestBed.inject(CartStore);
  });

  it('debería inicializarse con un carrito vacío', () => {
    expect(store.items()).toEqual([]);
    expect(store.total()).toBe(0);
    expect(store.count()).toBe(0);
  });

  it('debería agregar un producto al carrito', () => {
    const product = { _id: 'p1', name: 'Café', price: 10, stock: 5 };
    store.addToCart(product, 2);

    expect(store.items().length).toBe(1);
    expect(store.items()[0]).toEqual({
      product_id: 'p1',
      name: 'Café',
      price: 10,
      quantity: 2
    });
    expect(store.total()).toBe(20);
    expect(store.count()).toBe(2);
  });

  it('debería acumular cantidades al agregar el mismo producto sin exceder el stock', () => {
    const product = { _id: 'p1', name: 'Café', price: 10, stock: 5 };
    store.addToCart(product, 2);
    store.addToCart(product, 2);

    expect(store.items()[0].quantity).toBe(4);
    expect(store.total()).toBe(40);
    expect(store.count()).toBe(4);

    // Intentar exceder el stock (4 + 2 = 6, el stock es 5) -> No debería agregarse
    store.addToCart(product, 2);
    expect(store.items()[0].quantity).toBe(4);
    expect(store.total()).toBe(40);
  });

  it('debería quitar un producto del carrito', () => {
    const p1 = { _id: 'p1', name: 'Café', price: 10, stock: 5 };
    const p2 = { _id: 'p2', name: 'Muffin', price: 20, stock: 5 };
    store.addToCart(p1, 1);
    store.addToCart(p2, 1);

    expect(store.items().length).toBe(2);
    
    store.removeFromCart('p1');
    expect(store.items().length).toBe(1);
    expect(store.items()[0].product_id).toBe('p2');
    expect(store.total()).toBe(20);
  });

  it('debería limpiar el carrito', () => {
    const p1 = { _id: 'p1', name: 'Café', price: 10, stock: 5 };
    store.addToCart(p1, 2);
    expect(store.items().length).toBe(1);

    store.clear();
    expect(store.items()).toEqual([]);
    expect(store.total()).toBe(0);
    expect(store.count()).toBe(0);
  });
});
