import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private readonly messagesService;
    private readonly jwtService;
    private readonly usersService;
    server: Server;
    private logger;
    private parentSockets;
    constructor(messagesService: MessagesService, jwtService: JwtService, usersService: UsersService);
    onModuleInit(): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleRegisterParent(parentEmail: string, client: Socket): void;
    onSendMessage(data: {
        message: string;
    }, client: Socket): Promise<void>;
}
