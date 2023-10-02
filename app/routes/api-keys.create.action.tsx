import { type ActionArgs } from "@remix-run/node";
import { Backoffice } from "@models/backoffice/backoffice.server"
import { getSession } from "@models/backoffice/backoffice-cookie.server";
import { z } from 'zod';
import { AuthData } from "@middlewares/with-auth";

type CreateApiKeyActionForm = {
  days: string;
};

export type CreateApiKeyActionData = {
  apiKey?: string;
  days?: string;
  error?: string
};

export const action = async function action({ request }: ActionArgs) {
  // parse form
  const formData = await request.formData();
  const form = Object.fromEntries(formData) as CreateApiKeyActionForm;

  // define days schema
  const daysSchema = z.number().refine(n => n > 0, {
    message: "Days must be greater than 0"
  });

  // validate days schema
  try {
    daysSchema.parse(Number(form.days));
  } catch (error: any) {
    const [err] = error.errors
    return { days: err.message } as CreateApiKeyActionData
  }

  // get auth
  const session = await getSession(request.headers.get("Cookie"));
  const data: AuthData = session.get("backofficeSession");

  // request create api key to backoffice
  let apiKey: string
  try {
    ({ apiKey } = await Backoffice.createApiKey(Number(form.days), data.token));
  } catch (err: any) {
    return { error: "There was an error processing your request." } as CreateApiKeyActionData;
  }

  return { apiKey } as CreateApiKeyActionData
};
