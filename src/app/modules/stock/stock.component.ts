import { RoleService } from '@/app/services/role.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  
  constructor(public roleService: RoleService) { }

  ngOnInit(): void {
  }

}
