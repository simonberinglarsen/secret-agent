import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { database } from './database';
import { MessageStatus } from '../review/models/message';
import { Stats, StatusStats } from '../review/models/stats';

const maxRequestTimeMs = 2000;
const minRequestTimeMs = 500;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    console.log(`BACKEND: ${url}`);
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(
        delay(
          minRequestTimeMs +
            Math.floor(Math.random() * (maxRequestTimeMs - minRequestTimeMs))
        )
      )
      .pipe(dematerialize());

    function handleRoute() {
      const path = url.split(/\//).filter((x) => !!x);
      if (path.length === 0) {
        return next.handle(request);
      }
      if (method === 'GET') {
        return handleGet(path);
      }
      if (method === 'POST') {
        return handlePost(path, request.body);
      }
      return next.handle(request);
    }

    function handlePost(path: string[], body: any) {
      if (path[0] === 'messages' && path[1].startsWith('status') && !path[2]) {
        return postUpdateMessageStatus(
          <number[]>body.ids,
          <MessageStatus>body.status
        );
      }
      return next.handle(request);
    }

    function handleGet(path: string[]) {
      if (path[0] === 'countries' && !path[1]) {
        return getCountries();
      } else if (path[0] === 'stats' && !path[1]) {
        return getStats();
      } else if (path[0] === 'cities' && path[1] === 'ids' && !path[2]) {
        return getCityIds();
      } else if (path[0].startsWith('cities') && !path[1]) {
        const query = queryParam(path[0]);
        return getCitiesByCountry(+query.countryId);
      } else if (path[0].startsWith('missions') && !path[1]) {
        const query = queryParam(path[0]);
        return getMissionsByCityId(+query.cityId);
      } else if (path[0].startsWith('messages') && !path[1]) {
        const query = queryParam(path[0]);
        return getMessagesByCityId(+query.cityId);
      } else if (
        path[0] === 'messages' &&
        path[1].startsWith('details') &&
        !path[2]
      ) {
        const query = queryParam(path[1]);
        return getMessageDetailsById(+query.messageId);
      } else if (
        path[0] === 'missions' &&
        path[1].startsWith('details') &&
        !path[2]
      ) {
        const query = queryParam(path[1]);
        return getMissionDetailsById(+query.missionId);
      }

      return next.handle(request);
    }

    function queryParam(p: string) {
      const query: any = {};
      p.split(/[\?\&]/).forEach((param) => {
        const keyValue = param.split(/=/).filter((x) => !!x);
        if (keyValue.length !== 2) {
          return;
        }
        query[keyValue[0]] = keyValue[1];
      });
      return query;
    }

    // route functions
    function getCountries() {
      return ok(database.countries);
    }

    function getStats() {
      const cityStats: StatusStats[] = database.cities.map((city) => ({
        id: city.id,
        acceptedCount: database.messages.filter(
          (m) => m.cityId === city.id && m.status === MessageStatus.Accepted
        ).length,
        newCount: database.messages.filter(
          (m) => m.cityId === city.id && m.status === MessageStatus.New
        ).length,
        rejectedCount: database.messages.filter(
          (m) => m.cityId === city.id && m.status === MessageStatus.Rejected
        ).length,
      }));
      const countryStats: StatusStats[] = database.countries.map((country) => {
        const countryCities = database.cities.filter(city => city.countryId === country.id);
        const x = {
          id: country.id,
          acceptedCount: database.messages.filter(
            (m) => countryCities.find(city => city.id === m.cityId) && m.status === MessageStatus.Accepted
          ).length,
          newCount: database.messages.filter(
            (m) => countryCities.find(city => city.id === m.cityId) && m.status === MessageStatus.New
          ).length,
          rejectedCount: database.messages.filter(
            (m) => countryCities.find(city => city.id === m.cityId) && m.status === MessageStatus.Rejected
          ).length,
        };
        return x;
      });

      const stats: Stats = {
        cityStats,
        countryStats,
      };
      return ok(stats);
    }

    
    function postUpdateMessageStatus(ids: number[], status: MessageStatus) {
      let messages = database.messages.filter((m) => ids.includes(m.id));
      messages.forEach((m) => {
        m.status = status;
      });
      return ok(messages);
    }

    function getCitiesByCountry(countryId: number) {
      return ok(database.cities.filter((c) => c.countryId === countryId));
    }
    function getMissionsByCityId(cityId: number) {
      return ok(database.missions.filter((m) => m.cityId === cityId));
    }
    function getMessagesByCityId(cityId: number) {
      return ok(database.messages.filter((m) => m.cityId === cityId));
    }

    function getMessageDetailsById(id: number) {
      return ok(database.messageDetails.find((m) => m.messageId === id));
    }

    function getMissionDetailsById(id: number) {
      return ok(database.missionDetails.find((m) => m.missionId === id));
    }

    function getCityIds() {
      const uniqueIds: { [key: number]: number } = {};
      database.cities.forEach((c) => {
        uniqueIds[c.id] = 1;
      });
      return ok(Object.keys(uniqueIds).map((x) => +x));
    }

    // helper functions
    function ok(o?: any) {
      const text = JSON.stringify(o);
      const body = JSON.parse(text);
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: any) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
