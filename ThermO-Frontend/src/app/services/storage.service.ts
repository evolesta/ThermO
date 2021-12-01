import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
      this.init();    
   }

  async init() {
    await this.storage.create();
  }

  async set(key: string, value: any) {
    await this.storage?.set(key, value);
  }

  async get(key: string, value: any) {
    return await this.storage?.get(key);
  }

  async remove(key: string, value: any) {
    await this.storage?.remove(key);
  }
}
