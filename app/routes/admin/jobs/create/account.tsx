import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";
import { ethers } from "ethers";

type loaderData = {
  currentJob: JobsFormData;
};

export const loader: LoaderFunction = async () => {
  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  return json<loaderData>({ currentJob });
};

type actionData =
  | {
      pk: string;
    }
  | undefined;

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }
  console.log("current");

  const privateKey = `${body.get("privateKey")}`;
  const prov = ethers.getDefaultProvider(5);

  try {
    new ethers.Wallet(privateKey, prov);
  } catch (err) {
    return json({ pk: privateKey });
  }

  current.privateKey = privateKey as string;

  await redis.set("createdJobFormData", current);

  return redirect("/admin/jobs/create/confirm");
};

export default function StepAccount() {
  const { currentJob } = useLoaderData() as loaderData;
  const currentPk = currentJob.privateKey ? currentJob.privateKey : "";

  let [privateKey, setPrivateKey] = react.useState(currentPk);

  function onInputPrivateKey(privateKey: string) {
    setPrivateKey(privateKey);
  }

  const error = useActionData() as actionData;

  let isDisabled = false;
  if (error?.pk === privateKey) {
    isDisabled = true;
  }

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <Form method="post">
        <HStack justifyContent={"left"} w={"full"}>
          <VStack alignItems={"start"}>
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Account
            </Text>
            <Input
              name="privateKey"
              type="text"
              placeholder="Private key"
              width={"440px"}
              defaultValue={privateKey}
              onChange={(event) => {
                onInputPrivateKey(event.target.value);
              }}
            />
          </VStack>
        </HStack>
        <Text color={"red.400"}>
          {error ? "There is no address at the given private key" : null}
        </Text>

        <HStack
          w={"full"}
          justifyContent={"start"}
          pt={"12px"}
          spacing={"10px"}
        >
          <Button
            size={"sm"}
            colorScheme={"pink"}
            name={"_action"}
            value={"submit"}
            type="submit"
            disabled={privateKey === "" || isDisabled}
          >
            NEXT
          </Button>
          <Link to="/admin/jobs/create/cron">
            <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
              BACK
            </Button>
          </Link>
          <Button
            name={"_action"}
            value={"cancel"}
            size={"sm"}
            colorScheme={"pink"}
            variant={"ghost"}
            type="submit"
          >
            Cancel
          </Button>
        </HStack>
      </Form>
      <HStack>
        <VStack alignItems={"start"}>
          <Text fontSize={"20px"}>
            Fifth, insert the private key of your account.
          </Text>
          <Text color={"GrayText"} fontSize={"18px"}>
            The account will be responsible of executing the transaction over
            the{" "}
            <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
              action method.
            </Text>
          </Text>

          <Text color={"GrayText"} fontSize={"14px"}>
            <Text
              as="span"
              fontWeight={"bold"}
              borderBottom={"1px dotted #9FA2B4"}
            >
              Hint:{" "}
            </Text>
            Make sure you have enough gas in the selected network in order to
            complete the tx correctly. Otherwise, it will fail.
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}
