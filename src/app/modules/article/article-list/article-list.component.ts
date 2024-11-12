import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleService } from '@/app/services/article.service';
import { ArticleResponse } from '@/app/models/article.model';
import { APP_CONSTANTS } from '@/styles/constants';
import { RoleService } from '@/app/services/role.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  @Input() selectedEnabled: boolean = false;
  @Input() selectedArticles: ArticleResponse[] = [];
  @Output() articlesSelected = new EventEmitter<ArticleResponse[]>();
  @Input() columns: { field: string, header: string }[] = [
    { field: 'articleId', header: 'id' },
    { field: 'articleName', header: 'Nombre' },
    { field: 'articleDescription', header: 'Descripción' },
    { field: 'articleStock', header: 'Stock' },
    { field: 'articlePrice', header: 'Precio' },
    { field: 'brandNames', header: 'Marca' },
    { field: 'categoryNames', header: 'Categorías' },
  ];

  articles: ArticleResponse[] = [];
  actions: { label: string, action: string }[] = [];
  isCartVisible: boolean = false; 

  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.THREE;
  sortBy: string = APP_CONSTANTS.PAGINATION.NAME;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;

  searchBy: string[] = ['NAME', 'CATEGORY', 'BRAND'];
  searchValue: string = '';
  show: boolean = false;
  showAddTo: boolean = false;
  editArticle: ArticleResponse = {
    articleId: 0,
    articleName: '',
    articleDescription: '',
    articleStock: 0,
    articlePrice: 0,
    articleBrand: {
      brandName: '',
      brandId: 0
    },
    articleCategories: []
  };
showAdd: any;

  constructor(private readonly articleService: ArticleService,
    public readonly roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.search();
    this.setupActionsBasedOnRole(); 
  }

  setupActionsBasedOnRole(): void {
    const userRole = this.roleService.getUserRole();

    if (userRole === 'aux_bodega') {
      this.actions = [{ label: '🎁 Agregar', action: 'edit' }];
    } else if (userRole === 'customer') {
      this.actions = [{ label: 'Añadir 🛒', action: 'añadir' }];
    } else {
      this.actions = []; 
    }
  }

  search(): void {
    let searchByName = '';
    let searchByCategory = '';
    let searchByBrand = '';

    if (this.searchBy.includes('NAME')) {
      searchByName = this.searchValue;
    } else if (this.searchBy.includes('CATEGORY')) {
      searchByCategory = this.searchValue;
    } else if (this.searchBy.includes('BRAND')) {
      searchByBrand = this.searchValue;
    }

    this.articleService.getArticles(this.page, this.size, this.sortBy, this.sortDirection, searchByName, searchByCategory, searchByBrand)
      .subscribe({
        next: (response) => {
          this.articles = response.content.map((article: ArticleResponse) => {
            article['categoryNames'] = this.getCategoryNames(article);
            article['brandNames'] = article.articleBrand?.brandName || 'Sin Marca';
            return article;
          });
          this.totalPages = response.totalPages || 0;
        },
        error: (error) => {
          console.error('Error al cargar artículos:', error);
        }
      });
  }

  getCategoryNames(article: ArticleResponse): string {
    return article.articleCategories.map(category => category.categoryName).join(', ');
  }

  handleArticleChange(article: ArticleResponse[]): void {
    this.articlesSelected.emit(article);
  }

  updatePageSize(): void {
    if (this.size < 1) {
      this.size = 1;
    } else if (this.size > 10) {
      this.size = 10;
    }
    this.page = 0;
    this.search();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.search();
  }

  editRow(row: any): void {
    console.log('Editando artículo:', row);
    this.editArticle = row;
  }
  
  addtoCart(row: any): void {
    console.log('Añadiendo artículo al carrito:', row);
    this.editArticle = row;
  }

  onTableAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.editRow(event.row); 
      this.show = true;   
      this.isCartVisible = false;
    } else if (event.action === 'añadir') {
      this.addtoCart(event.row); 
      this.show = true;          
      this.isCartVisible = true; 
    }
  }

  closeModal(): void {
    this.show = false;
    this.search();
  }
}