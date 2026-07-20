import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Reparation {
  id: string;
  voiture: string;
  plaque: string;
  garage: string;
  date: string;
  status: 'EN_COURS' | 'TERMINEE' | 'DEVIS';
  progress: number;
  montant?: string;
}

@Component({
  selector: 'app-reparations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reparations.html'
})
export class Reparations {
  activeFilter: 'TOUT' | 'EN_COURS' | 'TERMINEE' | 'DEVIS' = 'TOUT';
  
  mockReparations: Reparation[] = [
    {
      id: 'REP-2023-084',
      voiture: 'Peugeot 3008 SUV',
      plaque: 'AB-123-CD',
      garage: 'Garage Mermoz Auto',
      date: '17 Juil 2026',
      status: 'EN_COURS',
      progress: 65
    },
    {
      id: 'REP-2023-042',
      voiture: 'Renault Clio V',
      plaque: 'DK-4567-G',
      garage: 'Sénégal Mécanique',
      date: '02 Juin 2026',
      status: 'TERMINEE',
      progress: 100,
      montant: '85 000 FCFA'
    },
    {
      id: 'DEV-2023-112',
      voiture: 'Toyota Corolla',
      plaque: 'TH-789-KL',
      garage: 'Auto Expert Dakar',
      date: '16 Juil 2026',
      status: 'DEVIS',
      progress: 0,
      montant: '120 000 FCFA'
    }
  ];

  get filteredReparations() {
    if (this.activeFilter === 'TOUT') {
      return this.mockReparations;
    }
    return this.mockReparations.filter(r => r.status === this.activeFilter);
  }

  setFilter(filter: 'TOUT' | 'EN_COURS' | 'TERMINEE' | 'DEVIS') {
    this.activeFilter = filter;
  }
}
