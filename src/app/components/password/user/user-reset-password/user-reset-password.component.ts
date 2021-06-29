import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResetPasswordService } from 'src/app/services/user/user-reset-password/user-reset-password.service';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent implements OnInit {

  resetPasswordService: UserResetPasswordService;
  constructor(private router: Router, private activatedRoute: ActivatedRoute , resetPasswordService: UserResetPasswordService) {
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
      this.router.navigate(['/user/forgotpassword']);
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
