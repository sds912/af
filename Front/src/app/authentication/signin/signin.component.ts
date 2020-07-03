import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/shared/service/security.service';

declare const $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  showPwd=false
  textError=""
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private securityServ:SecurityService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    //    [Focus input] * /
    $('.input100').each(function() {
      $(this).on('blur', function() {
        if (
          $(this)
            .val()
            .trim() != ''
        ) {
          $(this).addClass('has-val');
        } else {
          $(this).removeClass('has-val');
        }
      });
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.login()
    }
  }
  login(){
    this.securityServ.showLoadingIndicatior.next(true)
    this.textError=""
    this.securityServ.login(this.loginForm.value)
    .then(
      ()=>{
        this.router.navigate(['/dashboard/main'])
        this.securityServ.showLoadingIndicatior.next(false)
      },
      message=>{
        console.log(message)
        if(message.error && message.error.code && message.error.code==401)//celui la code
          this.textError="Login ou mot de passe incorrecte !"
        else if(message.error && message.error.status && message.error.status==403){//celui la status revoir le back
          this.textError="Ce compte est bloqué, veuillez contacter l'administrateur !"
        }
        this.securityServ.showLoadingIndicatior.next(false)
      }
    )
  }
}
