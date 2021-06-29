import { Component, OnInit } from '@angular/core';
import { ForgetPasswordService } from 'src/app/services/company/forget-password/forget-password.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordService: ForgetPasswordService;
  constructor(forgetPasswordService: ForgetPasswordService ) {
    this.forgetPasswordService = forgetPasswordService;
   }
  emailResponse: string;
  ngOnInit(): void {
    
  }

  onSendingEmail(){
    let email ={
      "email": this.emailResponse
    }
    this.forgetPasswordService.sendingEmailToResetPassword(email).subscribe(response => {
      alert("Check your email to reset password!"); 
    },
    (error) => {
      console.log(error);
      console.log("in error");

    })
    
  }
}
