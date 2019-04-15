import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment.prod';

//http variables:
const apiKey = environment.apiKey;
const apiURL = environment.apiURL;

//apikey in the header:
const headers = new HttpHeaders({
  'X-Api-key': apiKey
})

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  //check it starts in the first news page:
  headlinesPage = 0

  //return to category:
  categoriaActual = '';
  categoriaPage = 0;

  constructor(
    private http: HttpClient
  ) { }

  private ejecutarQuery<T>(query: string) {
    query = apiURL + query;

    return this.http.get<T>(query, { headers })
  }

  getTopHeadlines() {

    //increment page:
    this.headlinesPage++
    return this.ejecutarQuery<RespuestaTopHeadlines>(`top-headlines?country=ar&page=${this.headlinesPage}`)
  }

  getTopHearlinesCat(categoria: string) {
    //check category, add a page if it is already there:
    if (this.categoriaActual === categoria) {
      this.categoriaPage++;
    } else {
      this.categoriaPage = 1;
      this.categoriaActual = categoria
    }

    return this.ejecutarQuery<RespuestaTopHeadlines>(`top-headlines?country=ar&category=${categoria}&page=${this.categoriaPage}`)
  }
}
