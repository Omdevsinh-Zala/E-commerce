import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ProductInfoComponent } from './product-info/product-info.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FooterComponent } from './footer/footer.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { SmallCardsComponent } from './product-info/small-cards/small-cards.component';
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MainRouterComponent } from './main-router/main-router.component';
import { LoginComponent } from './form/login/login.component';
import { SignupComponent } from './form/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';
import { FirebaseAppModule, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UpdateComponent } from './form/update/update.component';
import { HomeComponent } from './main-pages/home/home.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ResetComponent } from './form/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductInfoComponent,
    FooterComponent,
    SmallCardsComponent,
    MainRouterComponent,
    LoginComponent,
    SignupComponent,
    UpdateComponent,
    ResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatProgressSpinner,
    MatBadgeModule,
    MatTableModule,
    MatPaginator,
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    FirebaseAppModule,
    MatRadioModule,
    MatSelectModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
