import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleService } from '@/app/services/article.service';
import { ArticleResponse } from '@/app/models/article.model';
import { APP_CONSTANTS } from '@/styles/constants';

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
    { field: 'articleName', header: 'Nombre' },
    { field: 'articleDescription', header: 'Descripción' },
    { field: 'articleStock', header: 'Stock' },
    { field: 'articlePrice', header: 'Precio' },
    { field: 'brandNames', header: 'Marca' },
    { field: 'categoryNames', header: 'Categorías' }
  ];

  articles: ArticleResponse[] = [];

  page: number = APP_CONSTANTS.PAGINATION.ZERO;
  size: number = APP_CONSTANTS.NUMBER.THREE;
  sortBy: string = APP_CONSTANTS.PAGINATION.NAME;
  sortDirection: string = APP_CONSTANTS.PAGINATION.ASC;
  totalPages: number = APP_CONSTANTS.PAGINATION.ZERO;

  searchBy: string[] = ['NAME', 'CATEGORY', 'BRAND'];
  searchValue: string = '';

  constructor(private readonly articleService: ArticleService) { }

  ngOnInit(): void {
    this.search();
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
}