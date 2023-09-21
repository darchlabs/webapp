import { type ActionArgs, redirect } from "@remix-run/node";
import { getSession, commitSession } from "@models/backoffice/backoffice-cookie.server";
import { Backoffice } from "@models/backoffice/backoffice.server"
import { AuthData } from "@middlewares/with-auth";
import { z } from 'zod';

type SignupActionForm = {
  email: string;
  name: string;
  password: string;
};

export type SignupActionData = {
  email?: string;
  name: string;
  password?: string;
  error?: string
};

export const SignupAction = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as SignupActionForm;

  // define email schema
  const emailSchema = z.string().email({
    message: "The email entered must be valid."
  });
  
  // validate email schema
  try {
    emailSchema.parse(form.email);
  } catch (error: any) {
    const [err] = error.errors
    return { email: err.message } as SignupActionData
  }

   // define name schema
   const nameSchema = z.string().min(1, {
    message: "The name must be at least 1 character"
  })

  // validate name schema`
  try {
    nameSchema.parse(form.name)
  } catch (error: any) {
    const [err] = error.errors;
    return { name: err.message } as SignupActionData;
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
    return { password: err.message } as SignupActionData
  }
  
  //  get redirectTo query param
   const url = new URL(request.url);
   let redirectTo = url.searchParams.get("redirectTo");
   if (!redirectTo) {
     redirectTo = "/overview";
   }
  
  // request signup to backoffice
  try {
    await Backoffice.signup(form.email, form.name, form.password);
  } catch (err: any) {
    return { error: "There was an error processing your request, maybe the email/name/password are invalid." } as SignupActionData;
  }

  // request login to backoffice
  let token: string;
  try {
    ({token} = await Backoffice.login(form.email, form.password));
  } catch (err: any) {
    return { error: "There was an error processing your request." } as SignupActionData;  
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
