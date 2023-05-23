import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private name: string = '';
  constructor() {}
  
  setUserName(name: string) {  
    this.name = name;
  }
  getusername() {
    return this.name;
    
  }
}