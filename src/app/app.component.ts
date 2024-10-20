import { Component, OnInit} from '@angular/core';
import { VisibilityService } from './services/visibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  navbarVisible = true;
  footerVisible = true;

  constructor(private readonly visibilityService: VisibilityService) {}

  ngOnInit(): void {
    this.visibilityService.navbarVisible$.subscribe((visible) => {
      this.navbarVisible = visible;
    });
    this.visibilityService.footerVisible$.subscribe((visible) => {
      this.footerVisible = visible;
    });
  }
}