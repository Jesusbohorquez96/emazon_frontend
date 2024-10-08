import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from 'src/styles/constants';

@Component({
  selector: APP_CONSTANTS.APP_WELCOME.SELECTOR,
  templateUrl: APP_CONSTANTS.APP_WELCOME.TEMPLATE_URL,
  styleUrls: APP_CONSTANTS.APP_WELCOME.STYLE_URLS
})
export class WelcomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void { }
}


