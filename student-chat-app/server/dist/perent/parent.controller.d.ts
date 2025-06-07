import { Request } from 'express';
import { ParentService } from './perent.service';
export declare class ParentController {
    private readonly parentService;
    constructor(parentService: ParentService);
    getStudentInfo(req: Request): Promise<{
        name: string;
        score: number;
        flaggedMessages: any[];
    } | null>;
}
