import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";
import { redis } from "~/pkg/redis/redis.server";
import type { Abi, SynchronizerFormData } from "../../../../pkg/synchronizer/types";
import { synchronizer } from "~/pkg/synchronizer/synchronizer.server";

export async function action({ request }: ActionArgs) {
  // parse form data
  const body = await request.formData();

  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/admin/synchronizers/create/event");
  }

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdFormData");
    return redirect("/admin/synchronizers");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    return redirect("/admin/synchronizers/create/network");
  }

  // Create sync event
  await synchronizer.InsertEvent(current.address, current.network, current.raw!, current.nodeURL);

  // redirect to abi page
  await redis.del("createdFormData");
  return redirect("/admin/synchronizers");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  const current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    return redirect("/admin/synchronizers/create/network");
  }

  return json(current);
};

export default function StepConfirm() {
  const { address, raw } = useLoaderData<SynchronizerFormData>();

  const abi: Abi = JSON.parse(raw!);
  const [fetchLoading, setFetchLoading] = useState(false);

  const addrStart = address.substring(0, 7);
  const addrEnd = address.substring(address.length - 5, address.length);
  const addr = `${addrStart}...${addrEnd}`;

  return (
    <Form method="post">
      <Flex
        w={"full"}
        flexDirection={["column-reverse", "column-reverse", "row"]}
        justifyContent={"space-between"}
        alignItems={"start"}
      >
        <VStack
          mb={["15px", "15px", "15px"]}
          mt={["20px", "20px", "0px"]}
          w={["full", "full", "36%"]}
          alignItems={["start", "start", "stretch"]}
        >
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Synchronizer info
          </Text>

          <VStack alignItems={"start"} color={"gray.500"} fontSize={"14px"} spacing={"2px"}>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network
              </Text>
              : Ethereum
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Address
              </Text>
              : {addr}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Event
              </Text>
              : {abi.name}
            </Text>
          </VStack>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Confirm information before to create syncronizer
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            Remember you can't change information about the synchronizer afterwards, so if you want to make changes,
            you'll need to delete it first and then create a new one.
          </Text>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          isLoading={fetchLoading}
          disabled={fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
        >
          CREATE
        </Button>
        <Button size={"sm"} colorScheme={"pink"} variant={"outline"} type="submit" name="_action" value="back">
          BACK
        </Button>
        <Button
          disabled={fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          variant={"ghost"}
          type="submit"
          name="_action"
          value="cancel"
        >
          Cancel
        </Button>
      </HStack>
    </Form>
  );
}
