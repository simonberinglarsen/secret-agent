import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityListComponent } from './components/city-list/city-list.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { MessageDetailsComponent } from './components/message-details/message-details.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MissionDetailsComponent } from './components/mission-details/mission-details.component';
import { MissionListComponent } from './components/mission-list/mission-list.component';
import { ReviewPageComponent } from './components/review-page/review-page.component';
import { ReviewRoutingModule } from './review-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromReview from './reducers';
import { CityListEffects, CountryListEffects } from './effects';
import { MessageListEffects } from './effects/message-list.effects';
import { MissionListEffects } from './effects/mission-list.effects';

@NgModule({
  declarations: [
    CountryListComponent,
    CityListComponent,
    MissionListComponent,
    MessageListComponent,
    MissionDetailsComponent,
    MessageDetailsComponent,
    ReviewPageComponent,
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    StoreModule.forFeature(fromReview.reviewFeatureKey, fromReview.reducers),
    EffectsModule.forFeature([
      CountryListEffects,
      CityListEffects,
      MessageListEffects,
      MissionListEffects,
    ]),
  ],
})
export class ReviewModule {}
