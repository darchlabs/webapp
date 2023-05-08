import { HStack, VStack, Text, Input, Show, Flex, Button } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import { redis } from "@models/redis.server";
import type { NodeFormData } from "@models/nodes/index";

export async function action({ request }: ActionArgs) {
  // parse form data
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdNodeFormData");
    return redirect("/nodes");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdNodeFormData")) as NodeFormData;
  if (!current) {
    return redirect("/nodes/create/network");
  }

  // get network value from form and save in redis
  current.fromBlockNumber = Number(body.get("blockNumber"));
  await redis.set("createdNodeFormData", current);

  // redirect to confirm page
  return redirect("/nodes/create/confirm");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdNodeFormData")) as NodeFormData;
  if (!current) {
    return redirect("/nodes/create/network");
  }

  return json(current);
};

export default function StepBlockNumber() {
  const formData = useLoaderData<NodeFormData>();

  const [fetchLoading] = useState(false);
  const [blockNumber, setBlockNumber] = useState(formData.fromBlockNumber);
  const [ready, setReady] = useState(false);

  function handleOnChange(ev: React.ChangeEvent<HTMLInputElement>) {
    if (Number.isNaN(ev.target.value)) {
      return setBlockNumber(-1);
    }

    const fromBlockNumber = Number(ev.target.value);
    return setBlockNumber(fromBlockNumber);
  }

  React.useEffect(() => {
    if (blockNumber && !Number.isNaN(blockNumber) && blockNumber > 0) {
      return setReady(true);
    }

    return setReady(false);
  }, [blockNumber]);

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
          <HStack justifyContent={"start"} mb={"2px"}>
            <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
              Block number.
            </Text>
          </HStack>

          <Input
            name="blockNumber"
            value={blockNumber}
            onChange={(ev) => handleOnChange(ev)}
            fontSize={"12px"}
            size={"md"}
            placeholder="1000..."
          ></Input>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Second, select the block number to fork your network.
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            If you wan to fork the entire network, you only need to set the block number to 0.
          </Text>

          <Show above="md">
            <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
              <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
                Hint
              </Text>
              : you can fork mainnet from your interest block in order to avoid big amounts extra data.
            </Text>
          </Show>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          isLoading={fetchLoading}
          disabled={!ready}
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
        >
          NEXT
        </Button>
        <Link to={"/nodes/create/network"}>
          <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
            BACK
          </Button>
        </Link>
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
