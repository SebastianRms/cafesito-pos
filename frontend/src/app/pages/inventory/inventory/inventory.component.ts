import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  // Aquí guardaremos los productos que vienen del back
  products: any[] = [];
  productForm: FormGroup;
  isModalOpen = false;
  editingProductId: string | null = null;

  constructor() {
    // Definimos los campos del formulario
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        // Guardamos los datos. Recuerda que tu back devuelve { data: [...] }
        this.products = res.data;
      },
      error: (err) => {
        console.error('Error al traer productos:', err);
      },
    });
  }

  // Por ahora solo deja estas funciones vacías para que no truene el HTML
  deleteProduct(id: string) {
    if (confirm('¿Eliminar producto?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  openModal() {
    console.log('Abriendo modal para crear...');
    this.isModalOpen = true;
    this.editingProductId = null;
    this.productForm.reset();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  editProduct(product: any) {
    this.isModalOpen = true;
    this.editingProductId = product._id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      stock: product.stock
    });
  }

  resetForm() {
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      price: 0,
      stock: 0
    });
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.editingProductId) {
      // EDITAR
      this.productService.updateProduct(this.editingProductId, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        }
      });
    } else {
      // CREAR
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        }
      });
    }
  }
}
