import { dbConnnect } from "@/lib/dbConnect";
import userModel from "@/model/User";
import verifySchema from "@/schemas/verifySchema";

export async function POST(req: Request) {
  await dbConnnect();

  try {
    const { email, otp } = await req.json();

    const validation = verifySchema.safeParse({ otp });

    if (!validation.success) {
      const otpValidationError = validation.error?.format().otp?._errors[0];
      return Response.json(
        {
          success: false,
          message: otpValidationError,
        },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 400 }
      );
    }

    const isOtpValid = user?.verifyCode === otp;
    const isOtpExpired = new Date(user?.verifyCodeExpiry as Date) > new Date();

    console.log(" isOtpExpired : ", isOtpExpired);

    if (!isOtpValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid Otp",
        },
        { status: 400 }
      );
    }

    if (!isOtpExpired) {
      return Response.json(
        {
          success: false,
          message: "Expired otp",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
      {
        success: true,
        message: "User successfully verified.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error during verifying OTP!");
    return Response.json(
      {
        success: false,
        message: "Error during verifying OTP!",
      },
      { status: 400 }
    );
  }
}
