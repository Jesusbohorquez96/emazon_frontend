import { RoleService } from '@/app/services/role.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brand',  
  templateUrl: './brand.component.html',  
  styleUrls: ['./brand.component.scss']  
})
export class BrandComponent { 

  constructor(public roleService: RoleService) { }
}
