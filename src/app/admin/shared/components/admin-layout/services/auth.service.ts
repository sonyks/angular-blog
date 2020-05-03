import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, FbAuthResponse } from 'src/app/shared/interfaces';
import { Observable, throwError, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
    constructor(private httpClient: HttpClient) {
    }

    public error$: Subject<string> = new Subject<string>();
    get token(): string {
        const expDate = new Date(localStorage.getItem('fb-token-exp'));
        if (new Date() > expDate) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }
    login(user: User): Observable<any> {
        return this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
        .pipe(tap(this.setToken),
        catchError(this.handleError.bind(this)));
    }

    logout() {
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private handleError(error: HttpErrorResponse) {
        const {message} = error.error.error;
        console.log(message);
        switch (message) {
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Email is not found');
                break;
            case 'INVALID_EMAIL':
                this.error$.next('Email is invalid');
                break;
            case 'INVALID_PASSWORD':
                this.error$.next('Password is invalid');
                break;
        }
        return throwError(error);
    }

    private setToken(response: FbAuthResponse) {
        if (response) {
            const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', expDate.toString());
        } else {
            localStorage.clear();
        }
    }
}
