import {Component, OnInit} from 'angular2/core';
import {Hero} from './hero';
import { Router } from 'angular2/router';

@Component({
  selector: 'my-heroes',
  templateUrl: 'app/heroes.component.html',
  styleUrls: ['app/heroes.component.css']
})

export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;
	
	ngOnInit() {
		this.getHeroes();
  };

  constructor(private _router: Router, private _heroService: HeroService) { };

  onSelect(hero: Hero) { this.selectedHero = hero; };
	getHeroes() {
		this._heroService.getHeroes().then(heroes => this.heroes = heroes);
  };
  gotoDetail() {
    this._router.navigate(['HeroDetail', { id: this.selectedHero.id }]);
  }

}
