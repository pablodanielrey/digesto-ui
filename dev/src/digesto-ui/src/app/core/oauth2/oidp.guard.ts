import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Oauth2Service } from './oauth2.service';
import { Injectable } from '@angular/core';


@Injectable()
export class OidpGuard implements CanActivate {

    constructor(private router: Router, private oauthService: Oauth2Service) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let valid = this.oauthService.hasValidToken();
        if (!valid) {
            this.router.navigate(['/oauth2']);
            return false;
        }
        return valid;
    }
}


// @Injectable()
// export class OidpGuard implements CanActivate {

//     constructor(private router: Router, private oauthService: Oauth2Service) {
//     }

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//         return true;
//     }
// }
