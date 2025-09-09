import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlockUiService } from '../../../shared/services/block-ui.service';
import { EvolutionService } from '../../../shared/services/evolution.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-conexao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conexao.component.html',
  styleUrls: ['./conexao.component.scss'],
})
export class ConexaoComponent implements OnDestroy, OnInit {
  conectarFormGroup: FormGroup;
  qrCodeUrl: string | null = null;
  mensagemErro: string | null = null;
  segundosRestantes = 0;
  stateInstance: string = '';
  generateNewQrCode: boolean = false;
  instanciaGerada: boolean = false;
  conectado: boolean = false;

  private timerSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private evolutionService: EvolutionService,
    private blockUi: BlockUiService,
    private cdr: ChangeDetectorRef
  ) {
    this.conectarFormGroup = this.fb.group({
      nomeInstancia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  filtrarApenasNumeros(event: any) {
    const input = event.target as HTMLInputElement;
    const valorFiltrado = input.value.replace(/[^0-9]/g, '');
    input.value = valorFiltrado;
    this.conectarFormGroup.get('nomeInstancia')?.setValue(valorFiltrado, { emitEvent: false });
  }

  conectar() {
    this.executarAcao(() => this.evolutionService.createInstance(this.instanceName));
  }

  newQrCode() {
    this.executarAcao(() => this.evolutionService.newQrCode(this.instanceName));
  }

  private executarAcao(acao: () => any) {
    if (!this.conectarFormGroup.valid) {
      this.mensagemErro = 'Nome da instância é obrigatório e deve conter apenas números';
      return;
    }

    this.blockUi.start();
    this.resetarEstado();

    acao().subscribe({
      next: (blob: Blob) => {
        this.blockUi.stop();
        this.exibirQrCode(blob);
        this.instanciaGerada = true;
      },
      error: () => {
        this.blockUi.stop();
        this.instanciaGerada = false;
        this.mensagemErro = 'Erro ao processar instância. Tente novamente.';
      },
    });
  }

  statusInstance() {
    this.evolutionService.statusInstance(this.instanceName).subscribe({
      next: (resultado: any) => {
        if (resultado.state === 'open') {
          this.qrCodeUrl = '';
          this.stateInstance = resultado.state;
          this.generateNewQrCode = false;

          this.stopTimer();

          // Ativa blockUi e só depois de 5 segundos mostra o "conectado"
          this.blockUi.start();
          setTimeout(() => {
            this.conectado = true;
            this.blockUi.stop();
            this.cdr.detectChanges();
          }, 5000);
        }
      },
      error: (error) => console.error(error),
    });
  }

  private get instanceName(): string {
    return this.conectarFormGroup.value.nomeInstancia;
  }

  private resetarEstado() {
    this.qrCodeUrl = null;
    this.mensagemErro = null;
  }

  private exibirQrCode(blob: Blob) {
    const url = URL.createObjectURL(blob);
    this.qrCodeUrl = url;
    this.cdr.detectChanges();
    this.startQrCodeTimer(30);
  }

  private startQrCodeTimer(segundos: number) {
    this.stopTimer();
    this.segundosRestantes = segundos;

    this.timerSubscription = interval(1000).subscribe(() => {
      this.segundosRestantes--;

      if (this.segundosRestantes % 5 === 0) {
        this.statusInstance();
      }

      if (this.segundosRestantes <= 0) {
        this.qrCodeUrl = null;
        this.stopTimer();
      }

      this.cdr.detectChanges();
    });
  }

  private stopTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = null;
  }
}
