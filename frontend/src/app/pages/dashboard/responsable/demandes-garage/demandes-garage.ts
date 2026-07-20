import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-demandes-garage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="max-w-6xl mx-auto space-y-6">
  <div>
    <h2 class="text-2xl font-bold text-gray-800">Demandes du garage</h2>
    <p class="text-sm text-gray-500 mt-1">Consultez et assignez les demandes de réparation reçues par votre garage.</p>
  </div>

  <div *ngIf="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>

  <div *ngIf="!loading && demandes.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    </div>
    <h4 class="text-lg font-bold text-gray-800 mb-2">Aucune demande reçue</h4>
    <p class="text-gray-500">Votre garage n'a pas encore reçu de demandes de réparation de la part des clients.</p>
  </div>

  <div *ngIf="!loading && demandes.length > 0" class="space-y-4">
    <div *ngFor="let d of demandes" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
              [ngClass]="getStatutBadgeClass(d.statut)">
              {{ getStatutLabel(d.statut) }}
            </span>
            <span class="text-xs text-gray-400">{{ d.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">{{ d.descriptionProbleme }}</h3>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>🚗 {{ d.vehicule?.marque }} {{ d.vehicule?.modele }} ({{ d.vehicule?.annee }})</span>
            <span>👤 {{ d.client?.prenom }} {{ d.client?.nom }}</span>
            <span *ngIf="d.mecanicien">🔧 Assigné à : {{ d.mecanicien?.prenom }} {{ d.mecanicien?.nom }}</span>
          </div>
        </div>

        <div class="flex-shrink-0" *ngIf="d.statut === 'EN_ATTENTE'">
          <select (change)="onAssignerChange(d.id, $event)"
            class="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium">
            <option value="">-- Assigner un mécanicien --</option>
            <option *ngFor="let m of mecaniciens" [value]="m.id">{{ m.prenom }} {{ m.nom }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div *ngIf="actionMessage" class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold">
    {{ actionMessage }}
  </div>
</div>
  `
})
export class DemandesGarage implements OnInit {
  demandes: any[] = [];
  mecaniciens: any[] = [];
  loading = true;
  actionMessage = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // Charger les demandes
    this.apiService.get('/responsable/demandes').subscribe({
      next: (data: any) => {
        this.demandes = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
    // Charger les mécaniciens du garage
    this.apiService.get('/responsable/mon-garage').subscribe({
      next: (data: any) => {
        this.mecaniciens = data?.mecaniciens || [];
        this.cdr.detectChanges();
      }
    });
  }

  onAssignerChange(demandeId: number, event: any) {
    const mecanicienId = parseInt(event.target.value);
    if (!mecanicienId) return;
    this.apiService.put(`/responsable/demandes/${demandeId}/assigner`, { mecanicienId }).subscribe({
      next: () => {
        this.actionMessage = '✅ Mécanicien assigné avec succès !';
        this.cdr.detectChanges();
        this.loadData();
        setTimeout(() => { this.actionMessage = ''; this.cdr.detectChanges(); }, 3000);
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
