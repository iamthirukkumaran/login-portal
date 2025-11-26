import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["superadmin", "teacher", "student"],
      required: true,
      default: "student",
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this as any;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

const UserModel =
  (mongoose.models.User as mongoose.Model<any>) ||
  mongoose.model("User", UserSchema);

async function pushSuperAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas");

    // Super Admin Credentials
    const superAdminCredentials = {
      name: "Super Administrator",
      email: "superadmin@institute.com",
      password: "SuperAdmin@123", // Change this to a strong password
      role: "superadmin",
      permissions: ["all"],
    };

    console.log("\n📋 Super Admin Details:");
    console.log(`   Email: ${superAdminCredentials.email}`);
    console.log(`   Password: ${superAdminCredentials.password}`);
    console.log(`   Role: ${superAdminCredentials.role}`);

    // Check if super admin already exists
    const existingAdmin = await UserModel.findOne({
      email: superAdminCredentials.email,
    });

    if (existingAdmin) {
      console.log(
        "\n⚠️  Super Admin already exists in the database."
      );
      console.log(`   ID: ${existingAdmin._id}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);

      console.log("\n❓ Do you want to replace it? (This will update the password)");
      console.log(
        "   Note: Uncomment the code below and run again if you want to update."
      );

      // Uncomment below to update existing admin
      // existingAdmin.password = superAdminCredentials.password;
      // await existingAdmin.save();
      // console.log("✅ Super Admin credentials updated successfully!");

      return;
    }

    // Create new super admin
    const newAdmin = new UserModel(superAdminCredentials);
    await newAdmin.save();

    console.log("\n✅ Super Admin created successfully!");
    console.log(`   ID: ${newAdmin._id}`);
    console.log(`   Email: ${newAdmin.email}`);
    console.log(`   Role: ${newAdmin.role}`);

    console.log("\n🔐 Remember to change the password after first login!");
    console.log(
      "\n📝 Login credentials:"
    );
    console.log(`   Email: ${superAdminCredentials.email}`);
    console.log(`   Password: ${superAdminCredentials.password}`);

    await mongoose.connection.close();
    console.log("\n✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

pushSuperAdmin();
