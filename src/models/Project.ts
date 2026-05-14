import mongoose, { Schema, Document } from 'mongoose';

export interface ITask {
  title: string;
  completed: boolean;
}

export interface IProject extends Document {
  name: string;
  description: string;
  driveLinks: string[];
  tasks: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  driveLinks: [{ type: String }],
  tasks: [TaskSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);