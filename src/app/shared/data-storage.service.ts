import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  private url = 'https://recipe-book-ng-6c54f.firebaseio.com/';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
    ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(
      `${this.url}/recipes.json`,
      recipes
    ).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    this.http.get<Recipe[]>(`${this.url}/recipes.json`)
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      })).subscribe(recipes => {
        this.recipeService.setRecipes(recipes);
      });
  }

}
