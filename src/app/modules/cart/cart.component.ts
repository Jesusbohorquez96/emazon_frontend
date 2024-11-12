import { RoleService } from '@/app/services/role.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  
  constructor(public roleService: RoleService) { }
}
