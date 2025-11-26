import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../models/message';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl + '/message';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Message[]>(`${this.apiUrl}/getAll`);
  }

  getById(id: number) {
    return this.http.get<Message>(`${this.apiUrl}/find-by-id/${id}`);
  }

  getConversation(user1: number, user2: number) {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${user1}/${user2}`);
  }

  sendMessage(data: Message) {
    return this.http.post(`${this.apiUrl}`, data);
  }

  sendMessageWithFile(msg: Message, file: File | undefined) {
    const form = new FormData();
    form.append("contenu", msg.contenu);
    form.append("emetteurId",msg.emetteur.id!.toString());
    form.append("recepteurId", msg.recepteur.id!.toString());

    if (file) form.append("file", file);

    return this.http.post(`${this.apiUrl}/create-with-file`, form);
  }
  
  update(id: number, message: Message) {
    return this.http.put<Message>(`${this.apiUrl}/update/${id}`, message);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/delete-by-id/${id}`);
  }
}
