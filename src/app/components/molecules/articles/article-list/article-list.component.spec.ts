import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleListComponent } from './article-list.component';
import { ArticleService } from '@/app/services/article.service';
import { of, } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArticleListComponent', () => {
  let component: ArticleListComponent;
  let fixture: ComponentFixture<ArticleListComponent>;
  let articleService: ArticleService;

  const mockArticlesResponse = {
    content: [
      { id: 1, name: 'Article 1', articleCategories: [{ categoryName: 'Category 1' }] },
      { id: 2, name: 'Article 2', articleCategories: [{ categoryName: 'Category 2' }] }
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

 
  
});
