import { useRouteError, isRouteErrorResponse } from "@remix-run/react";

export const BaseError = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    console.log(`App Error(isRouteErrorResponse) = ${error}`);
  } else {
    console.log(`App Error = ${error}`);
  }

  return <>here in error section</>;
};
