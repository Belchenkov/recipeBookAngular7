import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  private url = 'https://recipe-book-ng-6c54f.firebaseio.com/';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
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
      return this.http.get<Recipe[]>(`${this.url}/recipes.json`)
      .pipe(
        map(recipes => {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
