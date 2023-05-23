import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userSignup: FormGroup;
  userLogin: FormGroup;
  messageelement: any;

  @Output()
  msgtochat = new EventEmitter<any>;

  constructor(
    private formbuilder: FormBuilder,
    private httpclient: HttpClient,
    private router: Router,
    private userservice: UserService
  ) {
    this.userSignup = new FormGroup({});
    this.userLogin = new FormGroup({});
  }
  ngOnInit(): void {
    this.userSignupForm();
  }

  userSignupForm() {
    this.userSignup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.userLogin = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }


  valuetochat() {
    this.msgtochat.emit(this.userLogin.get("username")?.value)
    this.userservice.setUserName(this.userLogin.get("username")?.value)
    console.log(this.userLogin.get("username")?.value);

    this.router.navigate(['/chat'])
  }


  save() {
    let formData: FormData = new FormData();
    formData.append('username', this.userSignup.get('username')?.value);
    formData.append('password', this.userSignup.get('password')?.value);
    this.httpclient
      .post('http://localhost:8080/addUser', formData)
      .subscribe((response: any) => {
        console.log(response);
        this.router.navigate(['/user']);

      }, (err: HttpErrorResponse) => {
        console.log(err);
        alert("Register Failed...")
        this.router.navigate(['/user']);
      });
  }

  userlogin() {
    let param = new HttpParams()
      .set('username', this.userLogin.get('username')?.value);
    this.httpclient
      .get('http://localhost:8080/checkuser', { params: param })
      .subscribe((response: any) => {
        this.userservice.setUserName(this.userLogin.get('username')?.value);
        this.router.navigate(['/chat']);
      }, (err: HttpErrorResponse) => {
        console.log(err);
        alert("Login Failed...")

      });
  }


}
