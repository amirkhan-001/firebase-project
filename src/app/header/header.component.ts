import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthotected = false;
  private userSub :Subscription;

  constructor(private dataStorag:DataStorageService,private authService:AuthService){}

  ngOnInit(){
    console.log('login');
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthotected = !!user;
    });
  }
  onLogout(){
    this.authService.logout();
  }
  onSeveRecipes(){
    this.dataStorag.storeRecipes();
  }
  onFatchRecipes(){
    this.dataStorag.fetchRecipes().subscribe();
  }
  ngOnDestroy(){
    this.userSub.unsubscribe()
  }
}
