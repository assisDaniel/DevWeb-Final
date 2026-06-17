import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { LucideHouse, LucideSquarePlus } from '@lucide/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, LucideHouse, LucideSquarePlus],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
}
