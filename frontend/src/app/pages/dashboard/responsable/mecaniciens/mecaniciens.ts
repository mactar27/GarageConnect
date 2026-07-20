import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-mecaniciens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mecaniciens.html'
})
export class Mecaniciens implements OnInit {
  mecaniciens: any[] = [];
  loading = true;
  garage: any = null;

  showAddModal = false;
  newMec = { nom: '', prenom: '', email: '', telephone: '', motDePasse: '' };
  addError = '';
  addSuccess = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.apiService.get('/responsable/mon-garage').subscribe({
      next: (data: any) => {
        this.garage = data;
        if (data && data.mecaniciens) {
          this.mecaniciens = data.mecaniciens;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ajouterMecanicien() {
    this.addError = '';
    this.addSuccess = '';
    if (!this.newMec.nom || !this.newMec.prenom || !this.newMec.email || !this.newMec.motDePasse) {
      this.addError = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    this.apiService.post('/responsable/mecaniciens', this.newMec).subscribe({
      next: (res: any) => {
        this.addSuccess = 'Mécanicien ajouté avec succès.';
        this.newMec = { nom: '', prenom: '', email: '', telephone: '', motDePasse: '' };
        this.loadData();
        setTimeout(() => { this.showAddModal = false; this.cdr.detectChanges(); }, 1500);
      },
      error: (err: any) => {
        this.addError = err.error?.message || 'Erreur lors de l\'ajout';
        this.cdr.detectChanges();
      }
    });
  }
}
