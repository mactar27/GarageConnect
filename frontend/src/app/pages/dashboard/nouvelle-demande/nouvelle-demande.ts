import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-nouvelle-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nouvelle-demande.html'
})
export class NouvelleDemande implements OnInit {
  vehicules: any[] = [];
  garages: any[] = [];
  
  loadingVehicules = true;
  loadingGarages = true;

  showAddVehiculeModal = false;
  newVehicule = { marque: '', modele: '', annee: null, immatriculation: '' };

  demande = { vehiculeId: '', garageId: '', descriptionProbleme: '' };
  
  error = '';
  success = '';

  constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadVehicules();
    this.loadGarages();
  }

  loadVehicules() {
    this.loadingVehicules = true;
    this.apiService.get('/client/vehicules').subscribe({
      next: (data: any) => {
        this.vehicules = data;
        this.loadingVehicules = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingVehicules = false; this.cdr.detectChanges(); }
    });
  }

  loadGarages() {
    this.loadingGarages = true;
    this.apiService.get('/client/garages').subscribe({
      next: (data: any) => {
        this.garages = data;
        this.loadingGarages = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingGarages = false; this.cdr.detectChanges(); }
    });
  }

  ajouterVehicule() {
    this.error = '';
    this.apiService.post('/client/vehicules', this.newVehicule).subscribe({
      next: () => {
        this.showAddVehiculeModal = false;
        this.newVehicule = { marque: '', modele: '', annee: null, immatriculation: '' };
        this.loadVehicules();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        // Si l'immatriculation existe déjà, on indique un message plus clair
        if (err.status === 500) {
          this.error = "Ce véhicule (ou cette immatriculation) est déjà enregistré.";
        } else {
          this.error = "Erreur lors de l'ajout du véhicule.";
        }
        this.cdr.detectChanges();
      }
    });
  }

  soumettreDemande() {
    this.error = '';
    this.success = '';
    if (!this.demande.vehiculeId || !this.demande.garageId || !this.demande.descriptionProbleme) {
      this.error = 'Veuillez remplir tous les champs de la demande.';
      return;
    }

    this.apiService.post('/client/demandes', {
      vehiculeId: parseInt(this.demande.vehiculeId),
      garageId: parseInt(this.demande.garageId),
      descriptionProbleme: this.demande.descriptionProbleme
    }).subscribe({
      next: () => {
        this.success = 'Demande de réparation envoyée avec succès !';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/dashboard/reparations']);
        }, 2000);
      },
      error: (err: any) => {
        this.error = "Erreur lors de l'envoi de la demande.";
        this.cdr.detectChanges();
      }
    });
  }
}
