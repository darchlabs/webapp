import { HStack, VStack, Text, Input, Show, Flex, Button } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { redis } from "~/pkg/redis/redis.server";
import type { NodeFormData } from "~/pkg/node/types";
import { utils } from "ethers";

export async function action({ request }: ActionArgs) {
  // parse form data
  const body  = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdNodeFormData");
    return redirect("/admin/nodes");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdNodeFormData")) as NodeFormData;
  if (!current) {
    return redirect("/admin/nodes/create/network");
  }

  // get network value from form and save in redis
  const blockNumber = body.get("blockNumber");
  current.fromBlockNumber = (blockNumber | 0) as Number;
  await redis.set("createdNodeFormData", current);

  // redirect to abi page
  return redirect("/admin/nodes/create/confirm");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdNodeFormData")) as NodeFormData;
  console.log("------- ------- -------->", current)
  if (!current) {
    return redirect("/admin/nodes/create/network");
  }

  return json(current);
};

export default function StepBlockNumber() {
  const formData = useLoaderData<NodeFormData>();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [blockNumber, setBlockNumber] = useState(formData.fromBlockNumber);

  // TODO (mt): update validation and make it work with button NEXT
  function shouldDisableNextButton(bn: string): Boolean | undefined {
    console.log("=======> ", bn)
    if (Number.isNaN(bn)) {
      return false;
    }
    return true;
  }

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
            name="address"
            value={blockNumber}
            onChange={(ev) => setBlockNumber(ev.target.value)}
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
          disabled={false}
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
        >
          NEXT
        </Button>
        <Link to={"/admin/nodes/create/network"}>
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
