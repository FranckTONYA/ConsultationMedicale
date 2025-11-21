import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrdonnanceService } from '../../core/services/ordonnance.service';
import { DocumentService } from '../../core/services/document.service';
import { Ordonnance } from '../../models/ordonnance';

@Component({
  selector: 'app-ordonnance-details',
  standalone: false,
  templateUrl: './ordonnance-details.component.html',
  styleUrls: ['./ordonnance-details.component.css']
})
export class OrdonnanceDetailsComponent implements OnInit {

  ordonnance!: Ordonnance;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordonnanceService: OrdonnanceService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.ordonnanceService.getById(id).subscribe({
      next: data => { this.ordonnance = data; this.isLoading=false; },
      error: () => { Swal.fire('Erreur','Impossible de charger l\'ordonnance','error'); this.isLoading=false; }
    });
  }

  viewDocument(doc: any) {
    this.isLoading = true;
    this.documentService.getOrdonnanceFileUrl(doc.urlStockage).then(url => {
      window.open(url, '_blank');
      this.isLoading = false;
    }).catch((err) => {
      Swal.fire('Erreur', err.error?.error ||'Impossible de charger le document', 'error');
      this.isLoading = false;
    });
  }

  retour() { this.router.navigate(['/ordonnance/list']); }
}
