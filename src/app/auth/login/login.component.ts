import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }
  return {
    doesNotContainQuestionMark: true,
  };
}

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }

  return of({ notUnique: true });
}

let initialEmailValue = '';

const savedForm = window.localStorage.getItem('saved-login-form');
if (savedForm) {
  const loadedForm = JSON.parse(savedForm);
  initialEmailValue = loadedForm.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
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

  ngOnInit() {
    // if (savedForm) {
    //   const loadedForm = JSON.parse(savedForm);
    //   this.form.patchValue({
    //     email: loadedForm.email,
    //   });
    // }

    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) =>
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          ),
      });

    this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  }

  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email],
      asyncValidators: [emailIsUnique],
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
