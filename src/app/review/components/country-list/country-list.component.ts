import { Component, OnInit } from '@angular/core';
import { Country } from '../../models/country';
import { CountryListActions } from '../../actions';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import * as fromReview from '../../reducers';
import { StatusStats } from '../../models/stats';

interface CountryWithStatusStats {
  country: Country;
  stat: StatusStats | null;
}

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
})
export class CountryListComponent implements OnInit {
  countries$: Observable<CountryWithStatusStats[]>;
  loading$: Observable<boolean>;
  selectedCountryId$: Observable<number | null>;

  constructor(private store: Store) {
    this.countries$ = combineLatest([
      store.select(fromReview.selectAllCountries),
      store.select(fromReview.selectStats),
    ]).pipe(
      map(([countries, stats]) => {
        return countries.map((country) => ({
          country: country,
          stat: stats?.countryStats.find((s) => s.id === country.id) || null,
        }));
      })
    );
    this.loading$ = combineLatest([
      store.select(fromReview.selectCountryLoading).pipe(startWith(false)),
      store.select(fromReview.selectStatsLoading).pipe(startWith(false)),
    ]).pipe(map(([l1, l2]) => l1 || l2));
    this.selectedCountryId$ = store.select(fromReview.selectSelectedCountryId);
  }

  ngOnInit(): void {
    this.store.dispatch(CountryListActions.enter());
  }

  itemClicked(country: Country) {
    this.store.dispatch(CountryListActions.selectCountry({ id: country.id }));
  }
}
