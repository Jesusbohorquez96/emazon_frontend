import { CartResponse } from '@/app/models/cart.model';
import { CartService } from '@/app/services/cart.service';
import { Component, Input } from '@angular/core';
import { APP_CONSTANTS } from '@/styles/constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent {

  @Input() selectedEnabled: boolean = false;
  @Input() selectedCartItems: CartResponse[] = [];
  actions: any[] = [
    { label: 'Eliminar', action: 'delete' }
  ];

  columns: { field: string, header: string }[] = [
    { field: 'articleId', header: 'Article ID' },
    { field: 'articleName', header: 'Nombre del Artículo' },
    { field: 'quantity', header: 'Cantidad' },
    { field: 'articlePrice', header: 'Precio' },
    { field: 'brandName', header: 'Marca' },
    { field: 'categoryNames', header: 'Categorías' },
    { field: 'total', header: 'Total' },
  ];

  cartItems: CartResponse[] = [];
  isEmpty: boolean = true;
  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.FOUR;
  sortBy: string = APP_CONSTANTS.PAGINATION.ID;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;
  lastAddUpdateDate: string | null = null;
  lastDeleteDate: string | null = null;

  constructor(
    private readonly cartService: CartService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCartByUser(this.page, this.size, this.sortBy, this.sortDirection)
      .subscribe(
        response => {
          this.cartItems = response.content || [];
          this.isEmpty = this.cartItems.length === 0;
          this.totalPages = response.totalPages || 0;
          this.cartItems.forEach(cartItem => {
            cartItem.categoryNames = cartItem.articleCategories.map((category: any) => category.categoryName).join(', ');
            cartItem.brandName = cartItem.articleBrand.brandName;
            cartItem.total = cartItem.articlePrice * cartItem.quantity;
          });
        },
        error => {
          console.error('Error al cargar artículos en el carrito:', error);
        }
      );
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadCartItems();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === APP_CONSTANTS.PAGINATION.ASC
      ? APP_CONSTANTS.PAGINATION.DESC
      : APP_CONSTANTS.PAGINATION.ASC;
    this.loadCartItems();
  }

  updatePageSize(): void {
    console.log('Page size updated:', this.size);

    if (this.size < 1) {
      this.size = 1;
    } else if (this.size > 10) {
      this.size = 10;
    }
    this.page = 0;
    this.loadCartItems();
  }

  deleteCartItem(articleId: number): void {
    const now = new Date().toISOString();
    this.cartService.deleteFromCart(articleId).subscribe(
      () => {
        this.lastDeleteDate = now;
        const name = this.cartItems.find(cartItem => cartItem.articleId === articleId)?.articleName;
        this.toastr.success(`Artículo ${name} eliminado del carrito`);
        this.loadCartItems();
      },
      error => {
        this.toastr.error(`Error al eliminar el artículo con ID ${articleId}:`, error);
      }
    );
  }

  handleAction(event: { action: string, row: any }): void {
    if (event.action === 'delete') {
      this.deleteCartItem(event.row.articleId);
    }
  }

  getLastDeleteDate(): string | null {
    return this.lastDeleteDate;
  }

  getLastAction(): { message: string, date: string | null } {
    const lastAddDate = this.cartItems && this.cartItems.length > 0
      ? new Date(Math.max(...this.cartItems.map(item => new Date(item.updateDate).getTime())))
      : null;

    const lastDeleteDate = this.lastDeleteDate ? new Date(this.lastDeleteDate) : null;

    if (lastAddDate && lastDeleteDate) {
      return lastAddDate > lastDeleteDate
        ? { message: 'Última actualización', date: lastAddDate.toLocaleString('es-ES') }
        : { message: 'Última actualización', date: lastDeleteDate.toLocaleString('es-ES') };
    }

    if (lastAddDate) {
      return { message: 'Última actualización', date: lastAddDate.toLocaleString('es-ES') };
    }

    if (lastDeleteDate) {
      return { message: 'Última actualización', date: lastDeleteDate.toLocaleString('es-ES') };
    }

    return { message: 'Sin actividad reciente', date: null };
  }
}