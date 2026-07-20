import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reparations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reparations.html'
})
export class Reparations implements OnInit {
  demandes: any[] = [];
  loading = true;

  showAvisModal = false;
  selectedMecanicienId: number | null = null;
  selectedDemandeId: number | null = null;
  avis = { note: 5, commentaire: '' };
  avisSuccess = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes() {
    this.loading = true;
    this.apiService.get('/client/demandes').subscribe({
      next: (data) => {
        this.demandes = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  validerDevis(devisId: number) {
    this.apiService.put(`/client/devis/${devisId}/valider`, {}).subscribe({
      next: () => {
        this.loadDemandes();
      }
    });
  }

  allerAuPaiement(demandeId: number) {
    this.router.navigate(['/dashboard/client/paiements'], { queryParams: { demandeId } });
  }

  ouvrirAvisModal(demande: any) {
    this.selectedDemandeId = demande.id;
    this.selectedMecanicienId = demande.mecanicienId;
    this.avis = { note: 5, commentaire: '' };
    this.showAvisModal = true;
    this.avisSuccess = '';
  }

  soumettreAvis() {
    if (!this.selectedMecanicienId) return;

    this.apiService.post('/client/avis', {
      mecanicienId: this.selectedMecanicienId,
      note: this.avis.note,
      commentaire: this.avis.commentaire
    }).subscribe({
      next: () => {
        this.avisSuccess = 'Merci pour votre avis !';
        setTimeout(() => {
          this.showAvisModal = false;
        }, 1500);
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
      'ACCEPTEE': 'Acceptée',
      'DEVIS_ENVOYE': 'Devis reçu',
      'DEVIS_VALIDE': 'Devis validé',
      'PAYEE': 'Payée',
      'EN_COURS': 'En cours',
      'TERMINEE': 'Terminée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  }
}
