import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['demandeId']) {
        this.demandeId = parseInt(params['demandeId']);
        this.loadDemandeDetails();
      } else {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDemandeDetails() {
    this.apiService.get('/client/demandes').subscribe({
      next: (demandes: any) => {
        this.demandeDetails = demandes.find((d: any) => d.id === this.demandeId);
        this.loading = false;
        this.cdr.detectChanges();
        
        if (!this.demandeDetails || this.demandeDetails.statut !== 'DEVIS_VALIDE') {
          this.router.navigate(['/dashboard/reparations']);
        }
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  simulerPaiement() {
    if (!this.demandeId) return;
    this.processing = true;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.apiService.post(`/client/demandes/${this.demandeId}/payer`, {
        montant: this.demandeDetails?.devis?.montantTotal || 0
      }).subscribe({
        next: () => {
          this.processing = false;
          this.success = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/dashboard/reparations']);
          }, 3000);
        },
        error: () => { this.processing = false; this.cdr.detectChanges(); }
      });
    }, 1500);
  }
}
