import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {narra} from '@narra/api';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LibraryValidator implements AsyncValidator {
  constructor(private narraLibraryService: narra.LibraryService) {
  }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors> | Observable<ValidationErrors> {
    return of();
  }
}
