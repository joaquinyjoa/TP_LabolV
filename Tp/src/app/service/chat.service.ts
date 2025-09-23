import { Injectable } from '@angular/core';
import { collectionData, Firestore, collection, addDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface ChatMessage {
  user: string;
  time: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private firestore: Firestore) {}

  getMessages(): Observable<ChatMessage[]> {
    const chatRef = collection(this.firestore, 'chat');
    const q = query(chatRef, orderBy('time'));
    return collectionData(q, { idField: 'id' }) as Observable<ChatMessage[]>;
  }

  sendMessage(message: ChatMessage) {
    const chatRef = collection(this.firestore, 'chat');
    return addDoc(chatRef, message);
  }
}
