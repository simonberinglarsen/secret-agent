import { Component, OnInit } from '@angular/core';
import { City } from '../../models/city';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReview from '../../reducers';
import { CityListActions } from '../../actions';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  cities$ : Observable<City[]>;
  loading$ : Observable<boolean>;
  selectedCityId$: Observable<number | null>;

  constructor(private store:Store) {
    this.cities$ = store.select(fromReview.selectAllCities);
    this.loading$ =  store.select(fromReview.selectCityLoading);
    this.selectedCityId$ = store.select(fromReview.selectSelectedCityId);
  }

  ngOnInit(): void {
  }

  itemClicked(city: City) {
    this.store.dispatch(CityListActions.selectCity({ id: city.id }));
  }
}
