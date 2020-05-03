import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../shared/post.service';
import { Observable } from 'rxjs';
import { Post } from '../shared/interfaces';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  post$: Observable<Post>;
  constructor(private activatedRoute: ActivatedRoute,
              private postsServices: PostsService) { }

  ngOnInit(): void {
    this.post$ = this.activatedRoute.params
      .pipe(switchMap((params: Params) => {
        return this.postsServices.getById(params['id']);
      }));
  }

}
