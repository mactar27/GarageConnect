import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-interventions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interventions.html'
})
export class Interventions implements OnInit {
  demandes: any[] = [];
  loading = true;

  // Devis Modal
  showDevisModal = false;
  selectedDemandeDevis: any = null;
  devis = { montantTotal: null, detailPieces: '' };
  devisSuccess = '';

  // Rapport Modal
  showRapportModal = false;
  selectedDemandeRapport: any = null;
  rapport = { contenu: '' };
  rapportSuccess = '';

  // Profil Mécanicien
  estDisponible: boolean = true;
  profilLoading = true;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProfil();
    this.loadDemandes();
  }

  loadProfil() {
    this.profilLoading = true;
    this.apiService.get('/mecanicien/profil').subscribe({
      next: (data: any) => {
        this.estDisponible = data.estDisponible;
        this.profilLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.profilLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleDisponibilite() {
    const nouveauStatut = !this.estDisponible;
    this.apiService.put('/mecanicien/disponibilite', { estDisponible: nouveauStatut }).subscribe({
      next: (res: any) => {
        this.estDisponible = res.mecanicien.estDisponible;
        this.cdr.detectChanges();
      }
    });
  }

  loadDemandes() {
    this.loading = true;
    this.apiService.get('/mecanicien/demandes').subscribe({
      next: (data: any) => {
        this.demandes = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  changerStatut(id: number, statut: string) {
    this.apiService.put(`/mecanicien/demandes/${id}/statut`, { statut }).subscribe({
      next: () => this.loadDemandes()
    });
  }

  // --- Devis ---
  ouvrirDevisModal(demande: any) {
    this.selectedDemandeDevis = demande;
    this.devis = { montantTotal: null, detailPieces: '' };
    this.showDevisModal = true;
    this.devisSuccess = '';
  }

  soumettreDevis() {
    if (!this.selectedDemandeDevis || !this.devis.montantTotal) return;

    this.apiService.post('/mecanicien/devis', {
      demandeId: this.selectedDemandeDevis.id,
      montantTotal: this.devis.montantTotal,
      detailPieces: this.devis.detailPieces
    }).subscribe({
      next: () => {
        this.devisSuccess = 'Devis envoyé avec succès !';
        this.loadDemandes();
        setTimeout(() => { this.showDevisModal = false; this.cdr.detectChanges(); }, 1500);
      }
    });
  }

  // --- Rapport / Terminer réparation ---
  ouvrirRapportModal(demande: any) {
    this.selectedDemandeRapport = demande;
    this.rapport = { contenu: '' };
    this.showRapportModal = true;
    this.rapportSuccess = '';
  }

  soumettreRapport() {
    if (!this.selectedDemandeRapport || !this.rapport.contenu) return;

    this.apiService.post('/mecanicien/rapports', {
      demandeId: this.selectedDemandeRapport.id,
      contenu: this.rapport.contenu
    }).subscribe({
      next: () => {
        this.rapportSuccess = 'Rapport enregistré et réparation terminée !';
        this.loadDemandes();
        setTimeout(() => { this.showRapportModal = false; this.cdr.detectChanges(); }, 1500);
      }
    });
  }

  getStatutBadgeClass(statut: string) {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ACCEPTEE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DEVIS_ENVOYE': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DEVIS_VALIDE': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'PAYEE': return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_COURS': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'TERMINEE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ANNULEE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string) {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'ACCEPTEE': 'Assignée',
      'DEVIS_ENVOYE': 'Devis envoyé',
      'DEVIS_VALIDE': 'Devis validé',
      'PAYEE': 'Payée',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  }
}
