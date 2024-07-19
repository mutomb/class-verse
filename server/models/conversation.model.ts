import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create Schema for for storing new/existing conversation between recipients (two users in private chat) as well as the last message sent
const ConversationSchema = new Schema({
    recipients: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    course: {type: mongoose.Schema.ObjectId, ref: 'Course'},
    lastMessage: {
        type: String,
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    },
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation
