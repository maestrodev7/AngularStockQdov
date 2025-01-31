import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FuseMockApiService } from '@fuse/lib/mock-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor() {}
}
