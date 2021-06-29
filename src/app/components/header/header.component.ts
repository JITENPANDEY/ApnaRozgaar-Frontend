import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app/app.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  appService: AppService;

  user = false;
  constructor(appService: AppService, public translate: TranslateService) {
    this.appService = appService;
    translate.addLangs(['English', 'Hindi']);

    if (localStorage['lang'] != null) this.translate.use(localStorage['lang']);
    else this.translate.use('English');
  }

  ngOnInit(): void {}

  onLanguageChange(lang) {
    localStorage['lang'] = lang;
    this.translate.use(localStorage['lang']);
  }
}
