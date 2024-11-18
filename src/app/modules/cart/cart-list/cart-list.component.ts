import { CartResponse } from '@/app/models/cart.model';
import { CartService } from '@/app/services/cart.service';
import { Component, Input } from '@angular/core';
import { APP_CONSTANTS } from '@/styles/constants';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from '@angular/core';

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
  filteredArticles: any[] = [];
  isMobileView: boolean = false;
  isEmpty: boolean = true;
  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.FOUR;
  sortBy: string = APP_CONSTANTS.NAME;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;
  lastAddUpdateDate: string | null = null;
  lastDeleteDate: string | null = null;
  noResultsDueToFilters: boolean = false;

  categories: string[] = [
    '4545',
    'Agua',
    'Alimentos',
    'Automotriz',
    'Basos',
    'Bebidas',
    'Belleza',
    'Calculadores',
    'Computadoras',
    'Deportes',
    'Electrónica',
    'Fotografía',
    'Helados',
    'Hogar',
    'Jardinería',
    'Juguetes',
    'Libros',
    'Mascotas',
    'Oficina',
    'Ropa',
    'Salud',
    'Sonidos',
    'Tecnología',
    'Ventiladores'
  ];
  brands: string[] = [
    'Adidas',
    'Apple',
    'Auteco',
    'Babaria',
    'Bajaj',
    'Bosch',
    'Canon',
    'Dell',
    'Edgars',
    'HP',
    'LG',
    'Mega',
    'Microsoft',
    'Nestlé',
    'Nike',
    'P&G',
    'Panasonic',
    'Postobon',
    'Samsung',
    'Sony',
    'Toyota'
  ];
  selectedCategory: string = '';
  selectedBrand: string = '';

  constructor(
    private readonly cartService: CartService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadFilteredArticles();
    this.checkScreenSize();
  }

  loadFilteredArticles(): void {
    const category = this.selectedCategory;
    const brand = this.selectedBrand;

    this.cartService.getFilteredArticles(this.page, this.size, this.sortBy, this.sortDirection, category, brand)
      .subscribe(
        response => {
          this.cartItems = response.content || [];

          this.isEmpty = this.cartItems.length === 0 && category === '' && brand === '';

          this.totalPages = response.totalPages || 0;
          this.cartItems.forEach(cartItem => {
            cartItem.categoryNames = cartItem.articleCategories.map((category: any) => category.categoryName).join(', ');
            cartItem.brandName = cartItem.articleBrand.brandName;
            cartItem.total = cartItem.articlePrice * cartItem.quantity;
          });

          if (this.isEmpty) {
            this.toastr.info('Tu carrito está vacío.');
          }
        },
        error => {
          console.error('Error al filtrar artículos:', error);
          this.cartItems = [];
          this.isEmpty = true;
        }
      );
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadFilteredArticles();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === APP_CONSTANTS.PAGINATION.ASC
      ? APP_CONSTANTS.PAGINATION.DESC
      : APP_CONSTANTS.PAGINATION.ASC;
    this.loadFilteredArticles();
  }

  updatePageSize(): void {
    console.log('Page size updated:', this.size);

    if (this.size < 1) {
      this.size = 1;
    } else if (this.size > 10) {
      this.size = 10;
    }
    this.page = 0;
    this.loadFilteredArticles();
  }

  deleteCartItem(articleId: number): void {
    const now = new Date().toISOString();
    this.cartService.deleteFromCart(articleId).subscribe(
      () => {
        this.lastDeleteDate = now;
        const name = this.cartItems.find(cartItem => cartItem.articleId === articleId)?.articleName;
        this.toastr.success(`Artículo ${name} eliminado del carrito`);
        this.loadFilteredArticles();
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
        : { message: 'Última eliminacion', date: lastDeleteDate.toLocaleString('es-ES') };
    }

    if (lastAddDate) {
      return { message: 'Última actualización', date: lastAddDate.toLocaleString('es-ES') };
    }

    if (lastDeleteDate) {
      return { message: 'Última eliminacion', date: lastDeleteDate.toLocaleString('es-ES') };
    }

    return { message: 'Sin actividad reciente', date: null };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }
}