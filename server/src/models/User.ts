import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { config } from "dotenv";
config();

// Định nghĩa giao diện cho token
interface IToken {
  token: string;
  createdAt: Date;
}

// Định nghĩa giao diện cho người dùng

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  date_of_birth?: Date;
  avatar?: string;
  bio?: string;
  website?: string;
  created_at?: Date;
  updated_at?: Date;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  //tokens: { token: string }[];
  tokens: IToken[];
  generateAuthTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}

interface IUser extends Document {
  refreshToken: string[];
  removeRefreshToken: (token: string) => Promise<void>;
}

interface IUserModel extends Model<IUser> {
  removeRefreshToken(token: string): Promise<void>;
  findByCredentials(email: string, password: string): Promise<IUser>;
}

// Định nghĩa schema cho token

const tokenSchema: Schema<IToken> = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Định nghĩa schema cho người dùng
const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
  },
  date_of_birth: {
    type: Date,
    required: true, // Bắt buộc phải có giá trị cho trường này
  },
  created_at: {
    type: Date,
    default: Date.now, // Gán mặc định là thời gian hiện tại khi tạo mới tài liệu
  },
  updated_at: {
    type: Date,
    default: Date.now, // Gán mặc định là thời gian hiện tại khi tạo mới tài liệu
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: 160,
  },
  website: {
    validate(value: string) {
      if (value && !validator.isURL(value)) {
        throw new Error("Invalid URL");
      }
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  /*tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],*/
  tokens: [tokenSchema],
});

// Hash mật khẩu trước khi lưu người dùng
userSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Tạo Access Token và Refresh Token xác thực cho người dùng

userSchema.methods.generateAuthTokens = async function (): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const user = this;
  // Tạo Access Token
  const accessToken = jwt.sign(
    { id: user.id.toString() },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
  );

  // Tạo Refresh Token
  const refreshToken = jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  );

  // Lưu Refresh Token vào cơ sở dữ liệu
  user.tokens.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

// Xóa Refresh Token khi logout hoặc khi cần

userSchema.methods.removeRefreshToken = async function (
  token: string
): Promise<void> {
  const user = this;
  user.tokens = user.tokens.filter((t: IToken) => t.token !== token);
  await user.save();
};

// Tìm người dùng bằng thông tin đăng nhập

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
): Promise<IUser> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Login is Unsuccessful");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Login is Unsuccessful");
  }

  return user;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;