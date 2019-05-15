import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Role } from 'src/app/domain/Role';
import { Card } from 'src/app/domain/Card';

@Component({
  selector: 'app-roles-selection',
  templateUrl: './roles-selection.component.html',
  styleUrls: ['./roles-selection.component.scss']
})
export class RolesSelectionComponent {
  @Input()
  availableRoles: Role[];
  @Output()
  roleSelectionChange = new EventEmitter<Role[]>();

  private selectedRoles: number[] = [];

  toggleRoleSelection(index: number) {
    const idx = this.selectedRoles.indexOf(index);
    if (idx === -1) {
      this.selectedRoles.push(index);
    } else {
      this.selectedRoles.splice(idx, 1);
    }
    this.roleSelectionChange.emit(this.availableRoles.filter((role, i) => this.selectedRoles.includes(i)));
  }

  isRoleSelected(index: number) {
    return this.selectedRoles.indexOf(index) !== -1;
  }

  roleToCard(role: Role) {
    return new Card('', role, true);
  }
}
