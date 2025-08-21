import 'zone.js'; 
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Home } from './app/home/home';

// نعرّف routes
const routes: Routes = [
  { path: '', component: Home } // الصفحة الرئيسية = HomeComponent
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      FormsModule,
      RouterModule.forRoot(routes) // نربط Home كـ route رئيسية
    )
  ]
}).catch(err => console.error(err));
