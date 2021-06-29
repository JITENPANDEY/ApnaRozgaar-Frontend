import { AbstractControl, FormGroup } from "@angular/forms";
export function ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) =>{
      let password = formGroup.controls[controlName];
      let confirmPassword = formGroup.controls[matchingControlName]
      if (
        confirmPassword.errors &&
        !confirmPassword.errors.confirmPasswordValidator
      ) {
        return;
      }
      else if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ confirmPasswordValidator: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }