import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';




const material = [
  MatToolbarModule,
  MatTabsModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  FormsModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatMenuModule,
  MatChipsModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatGridListModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatExpansionModule

];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
