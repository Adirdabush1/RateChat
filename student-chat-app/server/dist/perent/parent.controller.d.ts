import { ParentService } from './perent.service';
export declare class ParentController {
    private readonly parentService;
    constructor(parentService: ParentService);
    getStudentInfo(parentEmail: string): Promise<{
        name: string;
        score: number;
        flaggedMessages: any[];
    } | null>;
}
