import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/formulaire-entreprise', title: 'Gestion entreprise', icon: 'house', class: ''},
    { path: '/formulaire-collaborateur', title: 'Gestion collaborateur', icon: 'supervisor_account', class: ''},
    { path: '/liste-collaborateurs', title: 'Liste collaborateurs', icon: 'list_alt', class: ''},
    { path: '/dashboard', title: 'Tableau de bord',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Mon compte',  icon:'person', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
