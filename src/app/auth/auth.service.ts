import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.module";

export interface AuthResponseData {
    kind: string
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?:boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpiretionTimer:any;
    constructor(private http: HttpClient, private router:Router) { }

    signup(email: string, password: string) {
        // this.http.post('POST https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=API_KEY')
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnNH6h2oCpmC1Bep5EJ4XwTrvVXLBZLcA',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.hendleError),tap(resData=>{
               this.handleAuthotication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
                
            }));
    }
    signin(email:string,password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnNH6h2oCpmC1Bep5EJ4XwTrvVXLBZLcA',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.hendleError),tap(resData=>{
            this.handleAuthotication(resData.email,resData.localId,resData.idToken,+resData.expiresIn);
             
         }));
    }
    autoLogin(){
        const userData:{
            email:string,
            id:string,
            _token:string,
            _tokenExpirationDate:string
        } = JSON.parse(localStorage.getItem('userData'));
        const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expiretionDuretion = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expiretionDuretion);
        }
        
    }
    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpiretionTimer){
            clearTimeout(this.tokenExpiretionTimer)
        }
        this.tokenExpiretionTimer=null;
    }
    autoLogout(expiretionDuretion:number){
        console.log(expiretionDuretion);
        this.tokenExpiretionTimer= setTimeout(()=>{
            this.logout()
        },expiretionDuretion)
    }
    private handleAuthotication(
        email:string,
        userId:string,
        tocken:string,
        expiresIn:number) {
        const expiretionDate = new Date(new Date().getTime as any + expiresIn +1000);
        const user = new User(email,userId,tocken,expiretionDate);
        this.user.next(user);
        this.autoLogout(expiresIn + 1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }
    private hendleError(errorRes:HttpErrorResponse){
        let errorMessage = 'unkonwn error ocure';
                if(!errorRes.error || !errorRes.error.error){
                    return throwError(errorMessage);
                }
                switch(errorRes.error.error.message){
                    case 'EMAIL_EXISTS':
                        errorMessage= "this email alredy exists";
                        break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = "email not found";
                        break;
                    case 'INVALID_PASSWORD':
                        errorMessage = "invalid password";
                        break;
                    }
                    return throwError(errorMessage);
    }
}