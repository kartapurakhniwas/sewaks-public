import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  constructor( private st: StorageService, ) { }

  ngOnInit(): void {
    this.st.remove("listoken");
    this.st.remove("userDetail");
  }

}
