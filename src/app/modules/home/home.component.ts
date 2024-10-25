import { Component } from '@angular/core';
import { APP_CONSTANTS } from 'src/styles/constants';
import { VisibilityService } from '@/app/services/visibility.service';
import { RoleService } from '@/app/services/role.service';

@Component({
  selector: APP_CONSTANTS.APP_HOME.SELECTOR,
  templateUrl: APP_CONSTANTS.APP_HOME.TEMPLATE_URL,
  styleUrls: APP_CONSTANTS.APP_HOME.STYLE_URLS
})
export class HomeComponent  {
  constructor(
    private readonly visibilityService: VisibilityService,
    public roleService: RoleService,
  ) {}

  ngOnInit(): void {
    this.visibilityService.hideNavbar();
    this.visibilityService.hideFooter();
  }

  ngOnDestroy(): void {
    this.visibilityService.showNavbar();
    this.visibilityService.showFooter();
  }
}