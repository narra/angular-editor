/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '@app/services';
import {RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {narra} from '@narra/api';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {
  @Input('authorship') authorship: narra.Authorship;
  @Input('purgable') purgable: narra.Purgable;
  @Input('pendable') pendable: narra.Pendable;

  // public
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }
}
