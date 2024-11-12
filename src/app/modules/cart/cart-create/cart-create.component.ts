
import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-cart-create',
  templateUrl: './cart-create.component.html',
  styleUrls: ['./cart-create.component.scss']
})
export class CartCreateComponent {

  articleId!: number;
  quantity: number = 1;
  successMessage: string = '';
  errorMessage: string = '';
  articleStocks: { [articleId: number]: number } = {};

  cartForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cartService: CartService,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {
    this.cartForm = this.fb.group({
      articleId: ['', [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addItemToCart() {
    if (this.cartForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente.');
      return;
    }

    const cart = this.cartForm.value;

    this.cartService.addToCart(cart).subscribe({
      next: () => {
        this.toastr.success('Artículo agregado al carrito exitosamente.');
        this.cartForm.reset({ quantity: 1 }); 
      },
      error: (error) => {
        if (error.status === 409) {
          this.toastr.error('No puedes agregar más de 3 artículos de esta categoría al carrito.');
        } else if (error.status === 500) {
          this.toastr.error('Error: Ya existe un artículo con el mismo ID en el carrito.');
        } else if (error.status === 404) {
          const restockDate = this.calculateRestockDate(7);
          this.toastr.error(`Stock insuficiente para el artículo. Fecha estimada de reabastecimiento: ${restockDate}`);
        } else {
          this.toastr.error('Error al agregar el artículo al carrito.');
        }
      }
    });
  }

  calculateRestockDate(days: number): string {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

