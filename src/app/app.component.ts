import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LateralMenuComponent } from './shared/components/lateral-menu/lateral-menu.component';
import { BlockUiService } from './shared/services/block-ui.service';
import { BlockUiComponent } from './shared/components/block-ui/block-ui.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LateralMenuComponent, BlockUiComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  protected readonly title = signal('chat');
}
