import { Button, HStack } from "@chakra-ui/react";
import { Link } from "@remix-run/react";

export function Footer({
  buttonText,
  isFetching,
  baseTo,
  backTo,
  omitTo,
}: {
  buttonText: string;
  isFetching: boolean;
  baseTo: string;
  backTo?: string;
  omitTo?: string;
}) {
  return (
    <HStack pt={5}>
      <Button
        textTransform={"uppercase"}
        isLoading={isFetching}
        disabled={isFetching}
        size={"sm"}
        colorScheme={"pink"}
        type="submit"
      >
        {buttonText}
      </Button>

      {backTo ? (
        <Link to={backTo}>
          <Button disabled={isFetching} variant="outline" size={"sm"} colorScheme={"pink"}>
            BACK
          </Button>
        </Link>
      ) : null}

      {omitTo ? (
        <Link to={omitTo}>
          <Button disabled={isFetching} variant="outline" size={"sm"} colorScheme={"pink"}>
            OMIT
          </Button>
        </Link>
      ) : null}

      <Link to={`/${baseTo}`}>
        <Button disabled={isFetching} size={"sm"} colorScheme={"pink"} variant={"ghost"}>
          Cancel
        </Button>
      </Link>
    </HStack>
  );
}
