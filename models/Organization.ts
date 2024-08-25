import mongoose, { Schema } from "mongoose";

interface Organization {
  name: string;
  description?: string;
}

const OrganizationSchema = new Schema<Organization>({
  name: { type: String, required: true },
  description: { type: String },
});

const OrganizationModel =
  mongoose.models.Organization ||
  mongoose.model<Organization>("Organization", OrganizationSchema);

export default OrganizationModel;
