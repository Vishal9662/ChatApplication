import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { privatechat } from '../private';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chat', { static: true }) 
  public chat: any;
  
  private stompClient?: any;
  chatForm: FormGroup;
  public users: any;
  username: string = '';
  chatarray: privatechat[] = [];
  senderElement: any;
  receiverElement: any;
  senderName: any;
  receiverName: any;
  receivedBody: privatechat = {
    sender: '',
    receiver: '',
    message: '',
  };
  mymap = new Map<string, privatechat[]>();
  isActivated: boolean = false;
  activeuser: string = 'None';

  constructor(
    private httpclient: HttpClient,
    private userservice: UserService,
    private formbuilder: FormBuilder
  ) {
    this.users = [];
    this.chatForm = this.formbuilder.group({});
    this.getUserlist();
    this.username = this.userservice.getusername();
  }
  ngOnInit(): void {
    this.chatFormInit();
  }

  chatFormInit() {
    this.chatForm = this.formbuilder.group({
      message: new FormControl(),
    });
  }

  getUserlist() {
    this.httpclient.get('http://localhost:8080/getall').subscribe(
      (response: any) => {
        this.users = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  stratChat(username: string) {
    this.activeuser = username;
    var socket = new SockJs('http://localhost:8080/connect');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect(
      {},
      (response: any) => {
        this.stompClient.subscribe(
          `/user/${this.activeuser}/private`,
          (response: any) => {
            this.receivedBody = JSON.parse(response.body);
            this.receivermessageDisplay(this.receivedBody['message'], this.receivedBody["sender"], 'private');
          }
        );
      },
      (error: any) => {
        console.log('Error' + error);
      }
    );
  }

  sendMessage() {
    console.log("message sent..!");

    if (this.activeuser === 'group') {
      let bodygroup = {
        sender: this.username,
        message: this.chatForm.get('message')?.value,
      };
      this.stompClient.send('/app/message', {}, JSON.stringify(bodygroup));
      this.sendermessageDisplay(bodygroup['message'], this.username, 'group');
    } else {
      let bodyprivate = {
        sender: this.username,
        receiver: this.activeuser,
        message: this.chatForm.get('message')?.value,
      };
      this.stompClient.send(
        '/app/private-message',
        {},
        JSON.stringify(bodyprivate)
      );
      this.chatarray.push(bodyprivate);
      this.mymap.set(this.username, this.chatarray);
      console.log(this.mymap);

      this.sendermessageDisplay(bodyprivate['message'], this.username, 'private');
    }
  }

  sendermessageDisplay(message: string, sender: string, chattype: string) {
    if (chattype === 'group') {
      this.senderElement = document.createElement('p');
      this.senderElement.classList.add('right', 'message');
      this.senderElement.innerHTML = `${message}`;
      this.chat.nativeElement.appendChild(this.senderElement);

      this.senderName = document.createElement('p');
      this.senderName.classList.add('user-name');
      this.senderName.innerHTML = `- ${this.username}`;
      this.senderElement.appendChild(this.senderName);
    } else {
      this.senderElement = document.createElement('p');
      this.senderElement.classList.add('right', 'message');
      this.senderElement.innerHTML = `${message}`;
      this.chat.nativeElement.appendChild(this.senderElement);
    }
  }

  receivermessageDisplay(message: string, sender: string, chattype: string) {
    if (chattype === 'group') {
      this.receiverElement = document.createElement('p');
      this.receiverElement.classList.add('left', 'message');
      this.receiverElement.innerHTML = `${message}`;
      this.chat.nativeElement.appendChild(this.receiverElement);

      this.receiverName = document.createElement('p');
      this.receiverName.classList.add('user-name');
      this.receiverName.innerHTML = `- ${sender}`;
      this.receiverElement.appendChild(this.receiverName);
    } else {
      this.receiverElement = document.createElement('p');
      this.receiverElement.classList.add('left', 'message');
      this.receiverElement.innerHTML = `${message}`;
      this.chat.nativeElement.appendChild(this.receiverElement);
    }
  }

  stratGroupChat(chatname: string) {
    this.activeuser = chatname;
    var socket = new SockJs('http://localhost:8080/connect');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect(
      {},
      (response: any) => {
        this.stompClient.subscribe(
          '/chatroom/public',
          (response: any) => {
            this.receivedBody = JSON.parse(response.body);
            console.log(this.receivedBody);
            if (!(this.receivedBody['sender'] === this.username)) {
              this.receivermessageDisplay(this.receivedBody['message'], this.receivedBody["sender"], 'group');
            }
          },
          { id: this.username }
        );
      },
      (error: any) => {
        console.log('Error' + error);
      }
    );
  }

}