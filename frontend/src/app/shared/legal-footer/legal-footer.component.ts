import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal-footer.component.html',
  styleUrl: './legal-footer.component.scss'
})
export class LegalFooterComponent {}