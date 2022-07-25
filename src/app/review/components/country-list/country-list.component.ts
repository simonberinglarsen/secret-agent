import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryListActions } from '../../actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromReview from '../../reducers';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  countries$ : Observable<Country[]>;
  loading$: Observable<boolean>;
  selectedCountryId$: Observable<number | null>;

  constructor(private store:Store) {
    this.countries$ = store.select(fromReview.selectAllCountries);
    this.loading$ =  store.select(fromReview.selectCountryLoading);
    this.selectedCountryId$ = store.select(fromReview.selectSelectedCountryId);
  }

  ngOnInit(): void {
    this.store.dispatch(CountryListActions.enter());
  }

  itemClicked(country: Country) {
    this.store.dispatch(CountryListActions.selectCountry({ id: country.id }));
  }

}
