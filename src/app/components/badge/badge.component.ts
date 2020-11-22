/**
 * @license
 *
 * Copyright (C) 2020 narra.eu
 *
 * This file is part of Narra Editor.
 *
 * Narra Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Narra Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Narra Angular API. If not, see <http://www.gnu.org/licenses/>.
 *
 * Authors: Michal Mocnak <michal@narra.eu>
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
