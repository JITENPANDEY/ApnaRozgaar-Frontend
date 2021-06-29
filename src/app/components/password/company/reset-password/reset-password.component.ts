import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/services/company/reset-password/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordService: ResetPasswordService;
  constructor(private router: Router, private activatedRoute: ActivatedRoute , resetPasswordService: ResetPasswordService) { 
    this.resetPasswordService = resetPasswordService;
  }
  token:string;
  passwordReseponse:string;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    })
    if(this.token==null){
      this.router.navigate(['/company/forgotpassword']);
    }
    
  }
  onResetPassword(){
    let password ={
      "password": this.passwordReseponse
    }
    console.log(password);
    
    this.resetPasswordService.onResetPasswordService(this.token, password).subscribe(response => {
      alert("your password has been reset"); 
      this.router.navigate(['/login']);
    },
    (error) => {
      console.log(error);
    })
    
  }
}