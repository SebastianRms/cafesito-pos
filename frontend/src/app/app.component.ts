import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  ngOnInit() {
    // Esta alerta saltará en cuanto cargue la app
    Swal.fire({
      title: '¡Sistema POS Listo!',
      text: 'Bootstrap y SweetAlert2 están configurados correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d6efd' // Color azul de Bootstrap
    });
  }
}
