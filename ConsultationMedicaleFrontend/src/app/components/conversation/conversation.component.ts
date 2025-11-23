import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { Message } from '../../models/message';
import { DocumentService } from '../../core/services/document.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conversation',
  standalone: false,
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  currentUserId!: number;
  otherUserId!: any;

  messages: Message[] = [];
  newMessage = "";
  selectedFile?: File;

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private msgService: MessageService,
    private authService: AuthService,
    private documentService: DocumentService,
  ) {}

  ngOnInit(): void {
    this.otherUserId = this.route.snapshot.paramMap.get('id');

    this.authService.userInfo$.subscribe(u => {
      this.currentUserId = u.id!;
      this.loadConversation();
    });
  }

  loadConversation() {
    console.log(this.currentUserId)
    console.log(this.otherUserId)
    this.msgService.getConversation(this.currentUserId, this.otherUserId)
      .subscribe(data => {
        console.log(data);
        this.messages = data;
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 50);
      });
  }

  send() {
    if (!this.newMessage.trim() && !this.selectedFile) return;

    const msg = new Message();
    msg.contenu = this.newMessage;
    msg.emetteur = { id: this.currentUserId } as any;
    msg.recepteur = { id: this.otherUserId } as any;

    console.log(msg);
    this.msgService.sendMessageWithFile(msg, this.selectedFile)
        .subscribe(() => this.afterSend());

    // if (this.selectedFile)
    //   this.msgService.sendMessageWithFile(msg, this.selectedFile)
    //     .subscribe(() => this.afterSend());
    // else
    //   this.msgService.sendMessage(msg)
    //     .subscribe(() => this.afterSend());
  }

  afterSend() {
    this.newMessage = "";
    this.selectedFile = undefined;
    this.loadConversation();
  }

  onFileSelected(ev: any) {
    this.selectedFile = ev.target.files[0];
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }

  viewDocument(doc: any) {
      this.isLoading = true;
      this.documentService.getMessageFileUrl(doc.urlStockage).then(url => {
        window.open(url, '_blank');
        this.isLoading = false;
      }).catch((err) => {
        Swal.fire('Erreur', err.error?.error ||'Impossible de charger le document', 'error');
        this.isLoading = false;
      });
  }
}