import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  text: { type: String, required: true },
});

const Answer = mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);

export default Answer;
