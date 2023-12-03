import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/_services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm : FormGroup;
  returnUrl : string;
  constructor(
    private fb : FormBuilder,
    private route: ActivatedRoute,
    private router : Router,
    private _auth : AuthenticationService
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f(){
    return this.loginForm.value;
  }
  createForm(){
    this.loginForm = this.fb.group({
      email : ['test@test.com',[Validators.required]],
      password : ['123456',[Validators.required]]
    });
  }
  async submit(){
    const {email,password} = this.f;
    const user : User = await this._auth.logIn(email,password).toPromise();
    this.router.navigate(['/home']);
  }
}
