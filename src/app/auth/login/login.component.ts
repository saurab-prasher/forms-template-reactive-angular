import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return {
    doesNotContainQuestionMark: true,
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // private form = viewChild.required<NgForm>('form');
  // private destroyRef = inject(DestroyRef);
  // constructor() {
  //   afterNextRender(() => {
  //     const savedForm = window.localStorage.getItem('saved-login-form');
  //     if (savedForm) {
  //       const loadedFormData = JSON.parse(savedForm);
  //       const savedEmail = loadedFormData.email;
  //       setTimeout(() => {
  //         this.form().controls['email'].setValue(savedEmail);
  //       }, 1);
  //     }
  //     const subscription = this.form()
  //       .valueChanges?.pipe(debounceTime(500))
  //       .subscribe({
  //         next: (value) => {
  //           window.localStorage.setItem(
  //             'saved-login-form',
  //             JSON.stringify({ email: value.email })
  //           );
  //         },
  //       });
  //     this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  //   });
  // }
  // onSubmit(formData: NgForm) {
  //   if (formData.form.invalid) return;
  //   if (formData.form.valid) {
  //     const enteredEmail = formData.form.value.email;
  //     const enteredPassword = formData.form.value.password;
  //     console.log(enteredEmail, enteredPassword);
  //     formData.form.reset();
  //   }
  // }

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.invalid &&
      this.form.controls.email.dirty
    );
  }
  get passwordIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.invalid &&
      this.form.controls.password.dirty
    );
  }

  onSubmit() {
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}
