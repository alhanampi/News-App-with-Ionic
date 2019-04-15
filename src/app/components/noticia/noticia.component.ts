import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/interfaces/interfaces';

import { ActionSheetController, Platform } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from 'src/app/services/data-local.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  // noticia and indice are the data I need to know to load the news:
  @Input() noticia: Article
  @Input() indice: number;
  @Input() enFavoritos; //the type comes from the parent

  constructor(
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private actionSheetCtrl: ActionSheetController,
    private dataLocalService: DataLocalService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    console.log('favoritos', this.enFavoritos)
  }

  //URL comes from parent
  abrirNoticia() {
    //with this plugin, it opens in the browser:
    const browser = this.iab.create(this.noticia.url, '_system');
  }

  //action sheet:
  async lanzarMenu() {
    //favorite button behaviour, depending on which tab I am on:
    let guardarBorrarBtn;

    if (this.enFavoritos) {
      guardarBorrarBtn = {
        text: 'borrar favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          console.log('favorito clicked');
          this.dataLocalService.borrarNoticia(this.noticia) //service from local storage
        },
      }
    } else {
      guardarBorrarBtn = {
        text: 'guardar Favorito',
        icon: 'star',
        cssClass: 'action-dark',
        handler: () => {
          console.log('guardar clicked');
          this.dataLocalService.guardarNoticia(this.noticia) //service from local storage
        },
      }
    }

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Share clicked');

          this.compartirNoticia() //no arguments because noticia is global
        }
      }, guardarBorrarBtn,
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  //making deploy compatible:
  compartirNoticia() { //this only works with cordova
    if (this.platform.is('cordova')) {

      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      )
    } else { //in case cordova is not supported:
      if (navigator['share']) { //share is new so if it was outside '', ir may not be supported
        navigator['share']({
          title: this.noticia.title,
          text: this.noticia.description,
          url: this.noticia.url
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else { //in case neither share nor cordova is supported
        console.log('no se puede compartir porque no hay soporte')
      }
    }
  }
}