import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Article } from 'src/app/interfaces/interfaces';

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  @ViewChild(IonSegment) segment: IonSegment;

  //array for categories:
  categorias = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology"
  ];

  noticias: Article[] = [];

  //constructor calls the news service:

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit() {
    this.segment.value = this.categorias[2];
    this.cargarNoticias(this.categorias[2]);
  }

  cambioCategoria(event) {
    this.noticias = []; //reset so categories change instead of add
    this.cargarNoticias(event.detail.value);
  }

  cargarNoticias(categoria: string, event?) {
    this.noticiasService.getTopHearlinesCat(categoria).subscribe(resp => {
      this.noticias.push(...resp.articles);

      if (event) {
        event.target.complete();
      }
    });
  }

  loadData(event) {
    this.cargarNoticias(this.segment.value, event);
  }
}
