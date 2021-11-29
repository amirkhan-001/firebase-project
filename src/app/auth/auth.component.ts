import { Component } from "@angular/core";
import { NgModel } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";

@Component({
    selector:'app-auth',
    templateUrl:'./auth.component.html'
})
export class AuthComponent{
    isLoginMode = true;
    isLoading = false;
    error:string = null;
    

    constructor(private authService:AuthService, private router:Router){}
    onSubmit(form:NgModel){
        if(!form.valid){
            return;
        }
        const email=form.value.email;
        const password=form.value.password;
        let authObs:Observable<AuthResponseData>;
        this.isLoading = true;
        if(this.isLoginMode){
            authObs=this.authService.signin(email,password);
        }else{
            authObs=this.authService.signup(email,password) as any;
        }
        authObs.subscribe(resData=>{
            console.log(resData)
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        },errorMessage=>{
            console.log(errorMessage)
            
            this.error = errorMessage;
            this.isLoading = false;
        });
        // console.log(form);
        form.reset()
    }
    onSwitchMode(){
        this.isLoginMode=!this.isLoginMode
    }
}