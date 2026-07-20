import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paiements.html'
})
export class Paiements implements OnInit {
  demandeId: number | null = null;
  demandeDetails: any = null;
  loading = true;
  processing = false;
  success = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['demandeId']) {
        this.demandeId = parseInt(params['demandeId']);
        this.loadDemandeDetails();
      } else {
        this.loading = false;
      }
    });
  }

  loadDemandeDetails() {
    this.apiService.get('/client/demandes').subscribe({
      next: (demandes: any) => {
        this.demandeDetails = demandes.find((d: any) => d.id === this.demandeId);
        this.loading = false;
        
        // Rediriger si la demande n'est pas au statut DEVIS_VALIDE ou si elle est introuvable
        if (!this.demandeDetails || this.demandeDetails.statut !== 'DEVIS_VALIDE') {
          this.router.navigate(['/dashboard/reparations']);
        }
      },
      error: () => this.loading = false
    });
  }

  simulerPaiement() {
    if (!this.demandeId) return;
    this.processing = true;
    
    // On simule un délai de traitement de paiement (ex: appel Stripe/Wave)
    setTimeout(() => {
      this.apiService.post(`/client/demandes/${this.demandeId}/payer`, {
        montant: this.demandeDetails.devis[0].montantTotal
      }).subscribe({
        next: () => {
          this.processing = false;
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/dashboard/reparations']);
          }, 3000);
        },
        error: () => this.processing = false
      });
    }, 1500);
  }
}
