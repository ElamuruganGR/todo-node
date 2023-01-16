import mongoose from "mongoose";
const Schema = mongoose.Schema;
export interface ITodo {
  text: string;
  complete?: boolean;
  timestamp?: string;
}
const TodoSchema = new Schema<ITodo>({
  text: {
    type: String,
    required: true,
    default: "",
  },
  complete: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  }
});

export const Todo = mongoose.model<ITodo>("todo", TodoSchema);
