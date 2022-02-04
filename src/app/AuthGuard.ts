import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    if (url == "/login") {
      if (this.isUserLogged()) {
        this.router.navigate(['/dashboard'])
      }
      return !this.isUserLogged();

    }
    else {
      if (!this.isUserLogged()) {
        this.router.navigate(['/login'])
      }
      return this.isUserLogged();
    }
  }

  public isUserLogged() {
    if ((localStorage.getItem('syra_admin') != null) || (localStorage.getItem('syra_admin') != undefined)) {
      return true;
    }
    else {
      return false;
    }
  }
}
