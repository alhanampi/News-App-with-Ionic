import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  noticias: Article[] = [] //starts empty

  constructor(
    private storage: Storage,
    public toastCtrl: ToastController
  ) {
    //storage function
    this.cargarFavoritos()
  }

  //save in storage, push to news
  guardarNoticia(noticia: Article) {
    //check if it exists:
    const existe = this.noticias.find(noti => noti.title === noticia.title)

    if (!existe) {

      this.noticias.unshift(noticia); //unshift to push at the beggining
      this.storage.set('favoritos', this.noticias)
    }
    this.presentToast('agregado a favoritos')
  }


  //read storage:
  async cargarFavoritos() {
    const favoritos = await this.storage.get('favoritos')

    if (favoritos) {
      this.noticias = favoritos //save in favorites
    }
  }

  borrarNoticia(noticia: Article) {
    this.noticias = this.noticias.filter(noti => noti.title !== noticia.title);
    this.storage.set('favoritos', this.noticias)  //save result in storage
    this.presentToast('borrado de favoritos')
  }

  //toast after saving:
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}