import { RoleService } from '@/app/services/role.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent { 

  constructor(public roleService: RoleService) { }
}