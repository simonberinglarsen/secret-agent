import { Component, OnInit } from '@angular/core';
import { City } from '../../models/city';
import { combineLatest, map, Observable, of, startWith, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReview from '../../reducers';
import { CityListActions } from '../../actions';
import { Stats, StatusStats } from '../../models/stats';

interface CityWithStatusStats {
  city: City;
  stat: StatusStats | null;
}
@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit {
  cities$: Observable<CityWithStatusStats[]>;
  loading$: Observable<boolean>;
  selectedCityId$: Observable<number | null>;
  
  constructor(private store: Store) {
    this.cities$ = combineLatest([
      store.select(fromReview.selectAllCities),
      store.select(fromReview.selectStats),
    ]).pipe(
      map(([cities, stats]) => {
        return cities.map((city) => ({
          city: city,
          stat: stats?.cityStats.find((s) => s.id === city.id) || null,
        }));
      })
    );

    this.loading$ = combineLatest([
      store.select(fromReview.selectCityLoading).pipe(startWith(false)),
      store.select(fromReview.selectStatsLoading).pipe(startWith(false)),
    ]).pipe(map(([l1, l2]) => l1 || l2));

    this.selectedCityId$ = store.select(fromReview.selectSelectedCityId);
  }

  ngOnInit(): void {}

  itemClicked(city: City) {
    this.store.dispatch(CityListActions.selectCity({ id: city.id }));
  }
}
