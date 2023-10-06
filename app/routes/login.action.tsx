import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/backoffice/backoffice-cookie.server";
import {Backoffice} from "@models/backoffice/backoffice.server"
import { AuthData } from "@middlewares/with-auth";
import { z } from 'zod';
import { GetDarchlabsClient } from "@utils/get-darchlabs-client.server";

type LoginActionForm = {
  email: string;
  password: string;
};

export type LoginActionData = {
  email?: string;
  password?: string;
  error?: string
};

export const LoginAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as LoginActionForm;

  // define email schema
  const emailSchema = z.string().email({
    message: "The email entered must be valid."
  });
  
  // validate email schema
  try {
    emailSchema.parse(form.email);
  } catch (error: any) {
    const [err] = error.errors
    return { email: err.message } as LoginActionData
  }

  // define password schema
  const passwordSchema = z.string().refine(value => (
    // min 8 characters
    value.length >= 8 &&
    // at least one capital letter
    /[A-Z]/.test(value) &&
    // at least one lowercase letter
    /[a-z]/.test(value) &&
    // at least one special character
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
  ), {
    message: "The password must be at least 8 characters, one uppercase letter, one lowercase letter, and one symbol."
  });
  
  // validate password schema
  try {
    passwordSchema.parse(form.password);
  } catch (error: any) {
    const [err] = error.errors
    return { password: err.message } as LoginActionData
  }
  
  //  get redirectTo query param
   const url = new URL(request.url);
   let redirectTo = url.searchParams.get("redirectTo");
   if (!redirectTo) {
     redirectTo = "/overview";
   }
  
  // request login to backoffice
  let token: string
  try {
    ({token} = await Backoffice.login(form.email, form.password));
  } catch (err: any) {
    return { error: "There was an error processing your request, maybe the email/password are invalid." } as LoginActionData;
  }
  
  // upsert to create cookie
  const session = await getSession(request.headers.get("Cookie"));
  const data: AuthData = session.get("backofficeSession") || {} as AuthData;
  data.token = token
  data.email = form.email  

  // set token value in cookie
  session.set("backofficeSession", data);
  const cookie = await commitSession(session);

  // redirect
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
