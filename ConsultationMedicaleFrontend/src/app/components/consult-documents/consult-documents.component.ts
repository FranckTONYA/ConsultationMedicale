import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-consult-documents',
  standalone: false,
  templateUrl: './consult-documents.component.html',
  styleUrl: './consult-documents.component.css'
})
export class ConsultDocumentsComponent implements OnInit {

  consultationId!: number;

  existingDocs: any[] = [];
  selectedFiles: File[] = [];

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.consultationId = Number(this.route.snapshot.paramMap.get("id"));
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getByConsultation(this.consultationId)
      .subscribe(d => this.existingDocs = d);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let f of files) this.selectedFiles.push(f);
  }

  removeSelectedFile(i: number) {
    this.selectedFiles.splice(i, 1);
  }

  upload() {
    if (this.selectedFiles.length === 0) return;

    this.documentService.uploadFiles(this.consultationId, this.selectedFiles)
      .subscribe(() => {
        this.selectedFiles = [];
        this.loadDocuments();
      });
  }

  deleteDoc(id: number) {
    this.documentService.deleteDoc(id).subscribe(() => {
      this.loadDocuments();
    });
  }

  getFileUrl(name: string) {
    return this.documentService.getFileUrl(name);
  }
}
