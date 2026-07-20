import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Appointment {
  id: string;
  day: number;
  time: string;
  title: string;
  garage: string;
  type: 'DEPOT' | 'RECUPERATION' | 'REVISION';
}

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendrier.html'
})
export class Calendrier implements OnInit {
  currentDate = new Date(2026, 6, 1); // Start at July 2026 for demo consistency
  
  monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  get currentMonth() { return this.monthNames[this.currentDate.getMonth()]; }
  get currentYear() { return this.currentDate.getFullYear(); }
  
  daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarDays: { date: number; isCurrentMonth: boolean; isToday?: boolean; hasAppointment?: Appointment[] }[] = [];
  
  mockAppointments: Appointment[] = [
    { id: '1', day: 15, time: '09:00', title: 'Dépôt véhicule (Peugeot)', garage: 'Garage Mermoz Auto', type: 'DEPOT' },
    { id: '2', day: 17, time: '14:30', title: 'Révision annuelle (Renault)', garage: 'Sénégal Mécanique', type: 'REVISION' },
    { id: '3', day: 22, time: '16:00', title: 'Récupération (Toyota)', garage: 'Auto Expert Dakar', type: 'RECUPERATION' },
  ];

  ngOnInit() {
    this.generateCalendar();
  }

  isModalOpen = false;
  newAppt = {
    day: 1,
    time: '10:00',
    title: '',
    garage: 'Garage Mermoz Auto',
    type: 'DEPOT' as 'DEPOT' | 'RECUPERATION' | 'REVISION'
  };

  openModal() {
    this.isModalOpen = true;
    // Set default day to today or 1st if not current month
    this.newAppt = {
      day: new Date().getDate(),
      time: '10:00',
      title: '',
      garage: 'Garage Mermoz Auto',
      type: 'DEPOT'
    };
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveAppointment() {
    const appt: Appointment = {
      id: Math.random().toString(),
      day: Number(this.newAppt.day),
      time: this.newAppt.time,
      title: this.newAppt.title || 'Nouveau RDV',
      garage: this.newAppt.garage,
      type: this.newAppt.type
    };
    
    this.mockAppointments.push(appt);
    this.mockAppointments.sort((a, b) => a.day - b.day);
    this.generateCalendar();
    this.closeModal();
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  goToToday() {
    const today = new Date();
    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.generateCalendar();
  }

  generateCalendar() {
    this.calendarDays = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // JS getDay() returns 0 for Sunday, 1 for Monday. Convert to Monday-start.
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;
    
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Previous month filler days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({ date: daysInPrevMonth - i, isCurrentMonth: false, isToday: false });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      // Show mock appointments ONLY if we are in July 2026 (for the demo)
      let appointments: Appointment[] = [];
      if (year === 2026 && month === 6) {
        appointments = this.mockAppointments.filter(app => app.day === i);
      }
      
      const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;

      this.calendarDays.push({ 
        date: i, 
        isCurrentMonth: true, 
        isToday: isToday,
        hasAppointment: appointments.length > 0 ? appointments : undefined 
      });
    }
    
    // Next month filler days to complete the grid (usually up to 35 or 42 slots)
    const remainingSlots = 42 - this.calendarDays.length; // Always show 6 rows for consistency
    for (let i = 1; i <= remainingSlots; i++) {
      this.calendarDays.push({ date: i, isCurrentMonth: false, isToday: false });
    }
  }
}
