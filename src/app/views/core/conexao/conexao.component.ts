import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
export class ConexaoComponent implements OnDestroy {
  conectarFormGroup: FormGroup;
  qrCodeUrl: string | null = null;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  gerarNovoQrCode = false;
  isCreatingInstance = false;

  segundosRestantes: number = 0;
  private timerSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private evolutionService: EvolutionService,
    private blockUi: BlockUiService,
    private cdr: ChangeDetectorRef
  ) {
    this.conectarFormGroup = this.fb.group({
      nomeInstancia: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // apenas números
    });
  }

  ngOnDestroy(): void {}

  filtrarApenasNumeros(event: any) {
    const input = event.target as HTMLInputElement;
    const valorFiltrado = input.value.replace(/[^0-9]/g, '');
    input.value = valorFiltrado;
    this.conectarFormGroup.get('nomeInstancia')?.setValue(valorFiltrado, { emitEvent: false });
  }

  conectar() {
    if (!this.conectarFormGroup.valid) {
      this.mensagemErro = 'Nome da instância é obrigatório e deve conter apenas números';
      return;
    }

    this.isCreatingInstance = true;
    this.blockUi.start();
    this.resetarEstado();

    const instanceName = this.conectarFormGroup.value.nomeInstancia;

    this.evolutionService.createInstance(instanceName).subscribe({
      next: (blob: Blob) => {
        this.blockUi.stop();
        this.isCreatingInstance = false;
        this.exibirQrCode(blob);
        this.gerarNovoQrCode = true;
      },
      error: (error) => {
        this.blockUi.stop();
        this.isCreatingInstance = false;
        this.mensagemErro = 'Erro ao criar instância. Tente novamente.';
      },
    });
  }

  newQrCode() {
    if (!this.conectarFormGroup.valid) {
      this.mensagemErro = 'Nome da instância é obrigatório e deve conter apenas números';
      return;
    }

    this.isCreatingInstance = true;
    this.blockUi.start();
    this.resetarEstado();

    const instanceName = this.conectarFormGroup.value.nomeInstancia;

    this.evolutionService.newQrCode(instanceName).subscribe({
      next: (blob: Blob) => {
        this.blockUi.stop();
        this.isCreatingInstance = false;
        this.exibirQrCode(blob);
        this.gerarNovoQrCode = true;
      },
      error: (error: Error) => {
        this.blockUi.stop();
        this.isCreatingInstance = false;
        this.gerarNovoQrCode = true;
        this.mensagemErro = 'Erro ao gerar QR Code. Tente novamente.';
      },
    });
  }

  private resetarEstado() {
    this.qrCodeUrl = null;
    this.mensagemErro = null;
    this.mensagemSucesso = null;
    this.gerarNovoQrCode = false;
  }

  private exibirQrCode(blob: Blob) {
    const url = URL.createObjectURL(blob);
    this.qrCodeUrl = url;

    this.cdr.detectChanges();

    // Inicia o timer visível de 30 segundos
    this.startQrCodeTimer(30);
  }

  private startQrCodeTimer(segundos: number) {
    // Cancela qualquer timer existente
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.segundosRestantes = segundos;

    // Atualiza a cada segundo
    this.timerSubscription = interval(1000).subscribe(() => {
      this.segundosRestantes--;

      if (this.segundosRestantes <= 0) {
        this.qrCodeUrl = null;
        this.gerarNovoQrCode = true;
        this.timerSubscription?.unsubscribe();
      }

      this.cdr.detectChanges();
    });
  }
}
