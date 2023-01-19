import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link, useActionData } from "@remix-run/react";
import { type ActionArgs, redirect, json } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";
import { ethers } from "ethers";

type actionData =
  | {
      message: string;
      address: string;
      abi: string;
    }
  | undefined;

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs/create");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }

  const network = `${body.get("network")}`;
  const contractAddress = `${body.get("address")}`;
  const contractAbi = `${body.get("abi")}`;

  try {
    // TODO(nb): get network by its id
    const prov = ethers.getDefaultProvider(5);
    new ethers.Contract(contractAddress, contractAbi, prov);
  } catch (err) {
    const error = new Error(`${err}`);
    return json<actionData>({
      message: error.message,
      address: contractAddress,
      abi: contractAbi,
    });
  }

  // get provider and network values from form and save in redis
  current.address = contractAddress;
  current.abi = contractAbi;
  await redis.set("createdJobFormData", current);

  // redirect to cronjob page
  return redirect(`/admin/jobs/create/cron`);
};

export default function StepAddress() {
  let [address, setAddress] = react.useState("");
  let [abi, setAbi] = react.useState("");

  // TODO(nb): validate the formats inserted are correct in these functions
  function onInputAddress(address: string) {
    setAddress(address);
  }

  function onInputAbi(abi: string) {
    setAbi(abi);
  }

  const error = useActionData() as actionData;
  console.log("action data: ", error);

  // Disable NEXT button if the inputs are the same than those which were incorrect
  let isDisabled = false;
  if (error?.abi === abi && error?.address === address) {
    isDisabled = true;
  }

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Contract address
            </Text>
            <Input
              name="address"
              type="text"
              placeholder="0x..."
              width={"440px"}
              onChange={(event) => {
                onInputAddress(event.target.value);
              }}
            />
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Contract ABI
            </Text>
            <Input
              name="abi"
              type="text"
              placeholder="`['abi: ...]`"
              width={"440px"}
              onChange={(event) => {
                onInputAbi(event.target.value);
              }}
            />
            <HStack>
              {error ? (
                <Text color={"red.400"}>
                  The contract doesn't exist for the given address and abi.
                </Text>
              ) : null}
            </HStack>
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
                disabled={address === "" || abi === "" || isDisabled}
              >
                NEXT
              </Button>
              <Link to="/admin/jobs/create/provider">
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
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your address. Put your ABI.
        </Text>
      </HStack>
    </HStack>
  );
}
