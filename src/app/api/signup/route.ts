import { dbConnnect } from "@/lib/dbConnect";
import userModel from "@/model/User";
import signUpSchema from "@/schemas/signUpSchema";
import sendEmail from "@/utils/sendEmail";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  await dbConnnect();

  try {
    const { username, email, password } = await req.json();

    const validation = signUpSchema.safeParse({ username, email, password });

    const usernameValidationError =
      validation.error?.format().username?._errors[0];
    if (usernameValidationError) {
      return Response.json(
        {
          success: false,
          message: usernameValidationError,
        },
        { status: 400 }
      );
    }

    const emailValidationError = validation.error?.format().email?._errors[0];
    if (emailValidationError) {
      return Response.json(
        {
          success: false,
          message: emailValidationError,
        },
        { status: 400 }
      );
    }

    const passwordValidationError =
      validation.error?.format().password?._errors[0];
    if (passwordValidationError) {
      return Response.json(
        {
          success: false,
          message: passwordValidationError,
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    console.log(
      "existingUserVerifiedByUsername : ",
      existingUserVerifiedByUsername
    );

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
console.log('otp : ', otp);

    const existingUserByEmail = await userModel.findOne({ email });

    if (existingUserByEmail) {
      const existingUserVerifiedByEmail = await userModel.findOne({
        email,
        isVerified: true,
      });

      if (existingUserVerifiedByEmail) {
        return Response.json(
          {
            success: false,
            message: "Email address already exists",
          },
          { status: 400 }
        );
      } else {
        existingUserByEmail.username = username;
        existingUserByEmail.verifyCode = otp;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 15 * 60 * 60 * 1000
        );
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: new Date(Date.now() + 15 * 60 * 60 * 1000),
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      console.log("user : ", user);
    }

    interface EmailProps {
      email: string;
      otp: string;
    }

    await sendEmail({ email, otp } as EmailProps);

    return Response.json(
      {
        success: true,
        message: "An otp has send to your email",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error registering user : ", error);
    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
