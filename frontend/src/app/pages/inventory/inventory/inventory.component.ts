import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast/toast.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  products: any[] = [];
  productForm: FormGroup;
  isModalOpen = false;
  editingProductId: string | null = null;

  constructor() {
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
        this.products = res.data;
      },
      error: (err) => {
        console.error('Error al traer productos:', err);
        this.toastService.error('Error al cargar la lista de productos.');
      },
    });
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción borrará el producto del catálogo definitivamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#0f172a',
      color: '#f1f5f9'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.toastService.success('Producto eliminado con éxito.');
          },
          error: () => this.toastService.error('No se pudo eliminar el producto del servidor.')
        });
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      price: 0,
      stock: 0
    });
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
      this.productService.updateProduct(this.editingProductId, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.toastService.success('Producto actualizado en catálogo.');
        },
        error: () => this.toastService.error('No se pudo actualizar el producto.')
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.toastService.success('Producto agregado al catálogo.');
        },
        error: () => this.toastService.error('No se pudo crear el producto.')
      });
    }
  }
}
