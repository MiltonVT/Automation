import { BaseComponent } from './BaseComponent';

export class HeaderComponent extends BaseComponent {
  private get userMenu() { return this.root.locator('.user-menu'); }

  async openUserMenu() {
    await this.userMenu.click();
  }
}
