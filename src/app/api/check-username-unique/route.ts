import { dbConnnect } from "@/lib/dbConnect";
import userModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameSchema = z.object({
  username: usernameValidation,
});
export async function GET(req: Request) {
  await dbConnnect();
  try {
    const { searchParams } = new URL(req.url);

    const queryParams = { username: searchParams.get("username") };

    console.log(queryParams)

    const validateUsername = usernameSchema.safeParse(queryParams);

    console.log('validateUsername : ', validateUsername)
    if (!validateUsername.success) {
      const usernameValidationError =
        validateUsername.error?.format().username?._errors[0];
      return Response.json(
        {
          success: false,
          message: usernameValidationError || "Invalid username format!",
        },
        { status: 400 }
      );
    }

    const {username} = validateUsername.data
    const userExists = await userModel.findOne({ username, isVerified: true});
    if (userExists) {
      return Response.json(
        {
          success: false,
          message: "Username already registered!",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during checking if the username is unique: ", error);
    return Response.json(
      {
        success: false,
        message: "Username validation failed. Please try again.",
      },
      { status: 400 }
    );
  }
}
