import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { ArticleService } from '@/app/services/article.service';
import { of, throwError, } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let articleService: ArticleService;

  const mockArticlesResponse = {
    content: [
      { articleId: 1, articleName: 'Article 1', articleDescription: 'Description 1', articleStock: 10, articlePrice: 100, articleCategories: [{ categoryId: 1, categoryName: 'Category 1' }], articleBrand: { brandId: 1, brandName: 'Brand 1' } },
      { articleId: 2, articleName: 'Article 2', articleDescription: 'Description 2', articleStock: 20, articlePrice: 200, articleCategories: [{ categoryId: 2, categoryName: 'Category 2' }], articleBrand: { brandId: 2, brandName: 'Brand 2' } }
    ],
    totalPages: 2
  };

  beforeEach(async () => {
    const articleServiceMock = {
      getArticles: jest.fn().mockReturnValue(of(mockArticlesResponse))
    };

    await TestBed.configureTestingModule({
      declarations: [ArticleListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ArticleService, useValue: articleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleListComponent);
    component = fixture.componentInstance;
    articleService = TestBed.inject(ArticleService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should console.error"Error al cargar artículos:" when search fails', () => {
    const error = 'Error al cargar artículos:';
    jest.spyOn(console, 'error').mockReturnValue();

    articleService.getArticles = jest.fn().mockReturnValue(throwError(error));
    component.search();

    expect(console.error);
  });
 
  it('should call getArticles method from articleService when search is called', () => {
    component.search();

    expect(articleService.getArticles).toHaveBeenCalled();
  });

  it('should update page and call search when onPageChange is invoked', () => {
    component.page = 1;
    jest.spyOn(component, 'search'); 
  
    component.onPageChange(2); 
  
    expect(component.page).toBe(2); 
    expect(component.search).toHaveBeenCalled(); 
  });
 
  it('should set size to 1 if size is less than 1', () => {
    component.size = 0;
    jest.spyOn(component, 'search');
  
    component.updatePageSize();
  
    expect(component.size).toBe(1);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });
  
  it('should set size to 10 if size is greater than 10', () => {
    component.size = 15;
    jest.spyOn(component, 'search');
  
    component.updatePageSize();
  
    expect(component.size).toBe(10);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });
  
  it('should not change size if it is between 1 and 10', () => {
    component.size = 5;
    jest.spyOn(component, 'search');
  
    component.updatePageSize();
  
    expect(component.size).toBe(5);
    expect(component.page).toBe(0);
    expect(component.search).toHaveBeenCalled();
  });
  
  it('should al guardar la article seleccionada', () => {
    const article = { articleId: 1, articleName: 'Article 1', articleDescription: 'Description 1', articleStock: 10, articlePrice: 100, articleCategories: [{ categoryId: 1, categoryName: 'Category 1' }], articleBrand: { brandId: 1, brandName: 'Brand 1' } };
    component.handleArticleChange([article]);
    expect(component.articlesSelected);
  });

});
