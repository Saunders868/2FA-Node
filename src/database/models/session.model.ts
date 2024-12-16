import mongoose, { Document } from "mongoose";
import { thirtyDaysFromNow } from "../../common/utils/utils";

export interface SessionDocument extends Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    expiredAt: Date;
    createdAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    userAgent: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiredAt: {
        type: Date,
        required: true,
        default: thirtyDaysFromNow
    }
})

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;