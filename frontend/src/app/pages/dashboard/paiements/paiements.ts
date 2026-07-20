import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Invoice {
  id: string;
  date: string;
  garage: string;
  service: string;
  amount: string;
  status: 'PAYEE' | 'EN_ATTENTE';
}

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paiements.html'
})
export class Paiements {
  activeFilter: 'TOUT' | 'PAYEE' | 'EN_ATTENTE' = 'TOUT';
  
  mockInvoices: Invoice[] = [
    {
      id: 'INV-2026-089',
      date: '17 Juil 2026',
      garage: 'Garage Mermoz Auto',
      service: 'Révision Complète + Vidange',
      amount: '85 000 FCFA',
      status: 'EN_ATTENTE'
    },
    {
      id: 'INV-2026-042',
      date: '02 Juin 2026',
      garage: 'Sénégal Mécanique',
      service: 'Remplacement Plaquettes de Frein',
      amount: '45 000 FCFA',
      status: 'PAYEE'
    },
    {
      id: 'INV-2026-015',
      date: '14 Jan 2026',
      garage: 'Auto Expert Dakar',
      service: 'Diagnostic Électronique',
      amount: '25 000 FCFA',
      status: 'PAYEE'
    }
  ];

  get filteredInvoices() {
    if (this.activeFilter === 'TOUT') {
      return this.mockInvoices;
    }
    return this.mockInvoices.filter(inv => inv.status === this.activeFilter);
  }

  setFilter(filter: 'TOUT' | 'PAYEE' | 'EN_ATTENTE') {
    this.activeFilter = filter;
  }
}
