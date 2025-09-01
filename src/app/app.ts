import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LateralMenuComponent } from './shared/components/lateral-menu/lateral-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LateralMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('chat');
}
