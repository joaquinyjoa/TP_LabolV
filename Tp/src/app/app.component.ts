import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "primeng/toast";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
