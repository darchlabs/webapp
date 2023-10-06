import { useRouteError, isRouteErrorResponse, useNavigate, useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const BaseError = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  useEffect(() => {
    if (typeof error.message === "string" && error.message.includes("401")) {
      // redirect to logout action
      fetcher.submit(null, {
        method: "post",
        action: `/logout/action`,
      });
    }
  }, [error, navigate]);

  if (isRouteErrorResponse(error)) {
    console.log(`App Error(isRouteErrorResponse) = ${error}`);
  } else {
    console.log(`App sssError = ${error}`);
  }

  return <>here in error section</>;
};
