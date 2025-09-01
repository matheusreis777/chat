import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EvolutionService } from '../../shared/services/evolution.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-conexao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conexao.component.html',
  styleUrls: ['./conexao.component.scss'],
})
export class ConexaoComponent {
  conectarFormGroup: FormGroup;
  qrCodeUrl: string | null = null;
  loading = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;
  gerarNovoQrCode: boolean = false;

  segundosRestantes: number = 0;
  private timerSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private evolutionService: EvolutionService,
    private cdr: ChangeDetectorRef
  ) {
    this.conectarFormGroup = this.fb.group({
      nomeInstancia: ['', [Validators.required, Validators.pattern('^[a-z]+$')]],
    });
  }

  filtrarLetrasMinusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valorFiltrado = input.value.replace(/[^a-z]/g, '');
    input.value = valorFiltrado;
    this.conectarFormGroup.get('nomeInstancia')?.setValue(valorFiltrado, { emitEvent: false });
  }

  conectar() {
    if (!this.conectarFormGroup.valid) {
      this.mensagemErro = 'Nome da instância é obrigatório e deve conter apenas letras minúsculas';
      return;
    }

    this.loading = true;
    this.qrCodeUrl = null;
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    const instanceName = this.conectarFormGroup.value.nomeInstancia;

    this.evolutionService.createInstance(instanceName).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.qrCodeUrl = url;
        this.cdr.detectChanges();

        // Inicia o timer visível de 30 segundos
        this.startQrCodeTimer(30);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
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
