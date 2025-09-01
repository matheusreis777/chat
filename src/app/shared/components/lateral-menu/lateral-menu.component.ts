// lateral-menu.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lateral-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.scss'],
})
export class LateralMenuComponent {
  isConnected = false;

  toggleConnection() {
    this.isConnected = !this.isConnected;
  }
}
