import { type LoaderFunction, type LoaderArgs, redirect } from "@remix-run/node";
import { getSession } from "@models/backoffice/backoffice-cookie.server";

export type AuthData = {
	token: string;
	userId: string;
	email: string;
}

export type Auth = {
	data: AuthData;
	cookie: string;
};

export function withAuth(fn: LoaderFunction): LoaderFunction {
	return async (args: LoaderArgs) => {
		// get auth
		const session = await getSession(args.request.headers.get("Cookie"));
		const data: AuthData = session.get("backofficeSession");

		// check excluded auth routes
		const excludedRoutes = ["/login", "/signup"];
		const { url } = args.request
		const isExcludedRoute = excludedRoutes.some(route => url.includes(route));
		
		// return to login if dont have valid auth info
		if (!data?.token && !isExcludedRoute) {
			return redirect("/login");
		}

		// add token to context
		args.context.auth = data;

		return fn(args);
	};
}
///