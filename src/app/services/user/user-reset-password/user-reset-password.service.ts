import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserResetPasswordService {

  baseUrl = environment.baseUrl;

  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  onResetPasswordService(token: string, password):Observable<any>{
    console.log("before reset");

    return this.http.post(`${this.baseUrl}`+'user/resetPassword/confirm?token='+ token , password);
  }
}
