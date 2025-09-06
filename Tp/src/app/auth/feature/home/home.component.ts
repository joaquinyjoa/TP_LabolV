import { Component } from '@angular/core';
import { RouterLink , Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  irAQuienSoy(): void {
    this.router.navigate(['/quiensoy']);
  }
}
