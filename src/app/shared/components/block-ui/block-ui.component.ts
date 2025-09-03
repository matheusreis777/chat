import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BlockUiService } from '../../services/block-ui.service';

@Component({
  selector: 'app-block-ui',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss'],
})
export class BlockUiComponent {
  loading$;
  spinnerType: 'circle' | 'dots' | 'chase' | 'pulse' = 'chase';

  constructor(private blockUiService: BlockUiService) {
    this.loading$ = this.blockUiService.loading$;
  }
}
