import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html'
})
export class Overview implements OnInit {
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getRole();
  }
}
