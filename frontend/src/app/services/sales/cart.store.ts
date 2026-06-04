import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  // 1. Estado privado reactivo
  private readonly _cart = signal<CartItem[]>([]);

  // 2. Read-only Signals expuestos
  readonly items = this._cart.asReadonly();

  // 3. Signals derivados con memoization (computed)
  readonly total = computed(() => 
    this._cart().reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  readonly count = computed(() => 
    this._cart().reduce((acc, item) => acc + item.quantity, 0)
  );

  addToCart(product: any, quantityToAdd: number) {
    if (quantityToAdd <= 0) return;
    
    this._cart.update((currentCart) => {
      const existing = currentCart.find((item) => item.product_id === product._id);
      
      if (existing) {
        if (existing.quantity + quantityToAdd <= product.stock) {
          return currentCart.map((item) =>
            item.product_id === product._id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
        }
        // En un POS real lanzaríamos un Toast, por ahora ignoramos si supera el stock
        return currentCart;
      }
      
      return [...currentCart, {
        product_id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantityToAdd
      }];
    });
  }

  removeFromCart(productId: string) {
    this._cart.update((currentCart) => 
      currentCart.filter((item) => item.product_id !== productId)
    );
  }

  clear() {
    this._cart.set([]);
  }
}
