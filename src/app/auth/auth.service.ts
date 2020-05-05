import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private http: HttpClient
  ) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCqi0xu3IKmszLCRrcQ0Pd6kqJeV6Dx-qg',
      {
        email,
        password,
        returnSecureToken: true
      }
    ).pipe(catchError(errorRes => {
      let errorMessage = 'An error occurred!';

      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }

      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS' :
          errorMessage = 'This email exists already';
          break;
      }

      return throwError(errorMessage);
    }));
  }
}
