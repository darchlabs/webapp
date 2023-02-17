import { HStack, VStack, Text, Input, Show, Flex, Button } from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { redis } from "~/pkg/redis/redis.server";
import type { SynchronizerFormData } from "~/pkg/synchronizer/types";
import { utils } from "ethers";

export async function action({ request }: ActionArgs) {
  // parse form data
  const body = await request.formData();

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

  // get network value from form and save in redis
  current.address = body.get("address") as string;
  await redis.set("createdFormData", current);

  // redirect to abi page
  return redirect("/admin/synchronizers/create/abi");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    return redirect("/admin/synchronizers/create/network");
  }

  return json(current);
};

export default function StepAddress() {
  const formData = useLoaderData<SynchronizerFormData>();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [address, setAddress] = useState(formData.address);

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
              Contract address
            </Text>
            <Text fontWeight={"normal"} fontSize={"14px"} color={"#ED64A6"} borderBottom={"1px dotted #ED64A6"}>
              My addresses
            </Text>
          </HStack>

          <Input
            name="address"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            fontSize={"12px"}
            size={"md"}
            placeholder="0x..."
          ></Input>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Second, insert the address of the contract.
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            Remember that if your contract is not verified, you will have to enter the ABI manually, inserting only the
            object related to the event.
          </Text>

          <Show above="md">
            <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
              <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
                Hint
              </Text>
              : if you have associated a wallet, you can make use of{" "}
              <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
                aliases
              </Text>{" "}
              to make it easier to work with contract addresses. See{" "}
              <Text as="span" fontWeight={"bold"}>
                Addreses
              </Text>{" "}
              sidebar option.
            </Text>
          </Show>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          isLoading={fetchLoading}
          disabled={!utils.isAddress(address) || fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
        >
          NEXT
        </Button>
        <Link to={"/admin/synchronizers/create/network"}>
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
