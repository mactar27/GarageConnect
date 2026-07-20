import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public tService = inject(TranslationService);
  
  formData = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    role: 'CLIENT',
    terms: false
  };

  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.formData.terms) {
      this.error = 'Vous devez accepter les conditions d\'utilisation.';
      return;
    }

    this.loading = true;
    this.authService.register(this.formData).subscribe({
      next: () => {
        this.success = this.tService.t().SUCC_REG;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = err.error?.message || this.tService.t().ERR_INVALID;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loginWithGoogle() {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.http.post<any>('http://localhost:3001/api/auth/google/demo', {}).subscribe({
      next: (response: any) => {
        this.success = this.tService.t().SUCC_GOOGLE_REG;
        localStorage.setItem('token', response.token);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err: any) => {
        this.error = err.error?.message || this.tService.t().ERR_GOOGLE;
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
