import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from 'src/app/shared/post.service';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/shared/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, using } from 'rxjs';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  uSub: Subscription;
  constructor(private route: ActivatedRoute,
              private postsService: PostsService) { }
  
  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap((params: Params) => {
        return this.postsService.getById(params['id']);
      })).subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        });
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.uSub = this.postsService.update({
      ...this.post,
      id: this.post.id,
      text: this.form.value.text,
      title: this.form.value.title,
      author: this.post.author,
    }).subscribe(() => {

    });
  }
}
