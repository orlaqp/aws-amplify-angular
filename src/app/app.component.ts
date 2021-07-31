import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restaurant } from 'src/types/restaurant';
import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'doc-management-app';
  public createForm!: FormGroup;

  restaurants!: Array<Restaurant | null>;

  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    this.api.ListRestaurants().then(event => {
        this.restaurants = event.items as Restaurant[];
    });

    this.api.OnCreateRestaurantListener.subscribe( (event: any) => {
        const newRestaurant = event.value.data.onCreateRestaurant;
        this.restaurants = [newRestaurant, ...this.restaurants];
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating restaurant...', e);
    });
  }
}
