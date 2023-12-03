import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { AuthenticationService } from 'src/app/services/_services/authentication/authentication.service';
import { PostService } from 'src/app/services/_services/post/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  posts : Post[];
  constructor(
    private router : Router,
    private _auth : AuthenticationService,
    private _post : PostService
  ) { }
  ngOnInit(): void {
    this.getAllPosts();
  }
  async getAllPosts(){
    this.posts = await this._post.getAllPosts();
    console.log(this.posts);
  }
  logout(){
    this._auth.logout();
    this.router.navigate(['/login']);
  }
}
