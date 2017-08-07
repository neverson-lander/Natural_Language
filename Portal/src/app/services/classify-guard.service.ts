import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { ClassifyService } from './classify.service';

@Injectable()
export class ClassifyGuardLogin implements CanActivate {

  constructor(public classifyService: ClassifyService, private router: Router) {}

  canActivate() {
    return this.classifyService.classifyIn;
  }

}
