import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 1. Adicione esta linha no topo

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // 2. Coloque o RouterModule aqui dentro dos colchetes
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'locacoes-sergamix';
}