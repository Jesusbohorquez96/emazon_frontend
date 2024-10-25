import { RoleService } from '@/app/services/role.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  constructor(public roleService: RoleService) { }

  ngOnInit(): void {
  }

}
