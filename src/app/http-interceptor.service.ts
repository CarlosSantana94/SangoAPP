import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoaderServiceService} from './loader-service.service';
import {finalize} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

    private count = 0;

    constructor(private loaderService: LoaderServiceService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.count === 0) {
            this.loaderService.setHttpProgressStatus(true);
        }
        let modifiedReq = req.clone({
            headers: req.headers.set('idUsuario', 'noLogin'),
        });
        if (localStorage.getItem('uid') !== null) {
            console.log('header');
            modifiedReq = req.clone({
                headers: req.headers.set('idUsuario', localStorage.getItem('uid')),
            });

        }
        console.log(modifiedReq);
        this.count++;
        return next.handle(modifiedReq).pipe(
            finalize(() => {
                this.count--;
                if (this.count === 0) {
                    this.loaderService.setHttpProgressStatus(false);
                }
            }));
    }
}
