import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";

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

  // TODO(nb): validate the contract exists
  // get provider and network values from form and save in redis
  current.address = `${body.get("address")}`;
  current.abi = `${body.get("abi")}`;
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
                disabled={address === "" || abi === ""}
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
