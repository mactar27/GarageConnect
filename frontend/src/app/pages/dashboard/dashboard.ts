import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  isSidebarOpen = false;
  userRole: string | null = '';
  user: any = null;
  
  isNotifOpen = false;
  isProfileOpen = false;

  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private notifService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.userRole = this.authService.getRole();
      
      // Get user profile data
      this.http.get<any>('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).subscribe({
        next: (res) => this.user = res.user,
        error: (err) => console.error(err)
      });

      // Load notifications
      this.notifService.fetchNotifications().subscribe();
      this.notifService.notifications$.subscribe(notifs => {
        this.notifications = notifs;
        this.unreadCount = notifs.filter(n => !n.estLue).length;
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  toggleNotif() {
    this.isNotifOpen = !this.isNotifOpen;
    if (this.isNotifOpen) this.isProfileOpen = false;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) this.isNotifOpen = false;
  }

  markAsRead(id: number) {
    this.notifService.markAsRead(id).subscribe();
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      this.http.post<any>('http://localhost:3001/api/auth/avatar', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).subscribe({
        next: (res) => {
          this.user = res.user;
          this.isProfileOpen = false;
        },
        error: (err) => console.error(err)
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
