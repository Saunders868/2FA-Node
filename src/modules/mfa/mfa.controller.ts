import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { MFAService } from "./mfa.service";

export class MFAController {
    private mfaService: MFAService;

    constructor(mfaService: MFAService) {
        this.mfaService = mfaService;
    }
    
    public generateMFASetup = asyncHandler(
        async (req: Request, res: Response) => {
            await this.mfaService.generateMFASetup(req);
        }
    )
}