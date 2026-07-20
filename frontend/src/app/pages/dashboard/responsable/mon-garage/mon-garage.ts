import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-mon-garage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mon-garage.html'
})
export class MonGarage implements OnInit {
  garage: any = null;
  loading = true;
  error = '';
  success = '';

  nom = '';
  adresse = '';
  telephone = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadGarage();
  }

  loadGarage() {
    this.loading = true;
    this.apiService.get('/responsable/mon-garage').subscribe({
      next: (data: any) => {
        this.garage = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Garage non trouvé (pas encore créé) renverra null ou une erreur 404
      }
    });
  }

  creerGarage() {
    this.error = '';
    this.success = '';
    if (!this.nom || !this.adresse || !this.telephone) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.apiService.post('/responsable/mon-garage', {
      nom: this.nom,
      adresse: this.adresse,
      telephone: this.telephone
    }).subscribe({
      next: (res: any) => {
        this.success = 'Garage créé avec succès ! Il est en attente de validation par un administrateur.';
        this.garage = res;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors de la création du garage';
      }
    });
  }
}
