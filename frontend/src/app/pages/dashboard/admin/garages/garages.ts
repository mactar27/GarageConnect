import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-garages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './garages.html'
})
export class Garages implements OnInit {
  garages: any[] = [];
  loading = true;
  actionMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadGarages();
  }

  loadGarages() {
    this.loading = true;
    this.apiService.get('/admin/garages').subscribe({
      next: (data: any) => {
        this.garages = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  validerGarage(id: number) {
    this.apiService.put(`/admin/garages/${id}/valider`, {}).subscribe({
      next: () => {
        this.actionMessage = 'Garage validé avec succès.';
        this.loadGarages();
        setTimeout(() => this.actionMessage = '', 3000);
      }
    });
  }

  suspendreGarage(id: number) {
    this.apiService.put(`/admin/garages/${id}/suspendre`, {}).subscribe({
      next: () => {
        this.actionMessage = 'Garage suspendu.';
        this.loadGarages();
        setTimeout(() => this.actionMessage = '', 3000);
      }
    });
  }
}
