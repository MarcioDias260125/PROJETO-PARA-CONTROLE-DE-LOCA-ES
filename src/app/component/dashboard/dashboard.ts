import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Locacao } from '../../models/Locacao'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html', // Sem o .component
  styleUrl: './dashboard.css'      // Sem o .component
})
export class DashboardComponent implements OnInit {
  // ... (mesmo código de cálculo de dias que mandei antes)
}