import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showSplash = true;
  fadeSplash = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Start fading out after 2 seconds
    setTimeout(() => {
      this.fadeSplash = true;
      this.cdr.detectChanges(); // Force view update
    }, 2000);

    // Completely remove from DOM after 3 seconds
    setTimeout(() => {
      this.showSplash = false;
      this.cdr.detectChanges(); // Force view update
    }, 3000);
  }
}
