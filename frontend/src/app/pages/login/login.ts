import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public tService = inject(TranslationService);
  
  formData = {
    email: '',
    motDePasse: '',
    rememberMe: false
  };

  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.authService.login(this.formData.email, this.formData.motDePasse).subscribe({
        next: (response: any) => {
          this.success = this.tService.t().SUCC_LOGIN;
          // Redirection to dashboard
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
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
        this.success = this.tService.t().SUCC_GOOGLE;
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
