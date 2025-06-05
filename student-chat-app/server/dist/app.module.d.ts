import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class MongoConnectionService implements OnModuleInit {
    private readonly connection;
    constructor(connection: Connection);
    onModuleInit(): void;
}
export declare class AppModule {
}
