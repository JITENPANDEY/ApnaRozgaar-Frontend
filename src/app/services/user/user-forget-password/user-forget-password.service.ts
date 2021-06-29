import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserForgetPasswordService {

  // baseUrl
  baseUrl = environment.baseUrl;

  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  sendingEmailToResetPassword(email){
    return this.http.post(`${this.baseUrl}`+'user/resetPassword', email);
  }
}
