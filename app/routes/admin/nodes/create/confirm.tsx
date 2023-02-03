import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, Form, useTransition } from "@remix-run/react";
import { redis } from "../../../../pkg/redis/redis.server";
import type { NodeFormData } from "../../../../pkg/node/types";
import { node } from "../../../../pkg/node/node.server";

export async function action({ request }: ActionArgs) {
  // parse form data
  const body = await request.formData();

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

  // get block number
  await redis.set("createdNodeFormData", current);
  await node.PostNewNode(current.network, current.fromBlockNumber);
  await async function() {
    await redis.del("createdNodeFormData");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return;
  }();



  // redirect to abi page
  return redirect("/admin/nodes");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  const current = (await redis.get("createdNodeFormData")) as NodeFormData;
  if (!current) {
    return redirect("/admin/nodes/create/network");
  }

  return json(current);
};


export default function StepConfirm() {
  const { network, fromBlockNumber } = useLoaderData<NodeFormData>();
  // const [fetchLoading, setFetchLoading] = useState(false);

  const transition = useTransition();
  const fetchLoading = transition.submission?.formData.get("_action") === "submit";
  // function handleOnClickCreate() {
  //   setFetchLoading(true);
  // }
  
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
            Node info
          </Text>

          <VStack alignItems={"start"} color={"gray.500"} fontSize={"14px"} spacing={"2px"}>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network
              </Text>
              : {network}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Block Number
              </Text>
              : {fromBlockNumber}
            </Text>
          </VStack>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Confirm information before to create node
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            Remember you can't change information about the node afterwards, so if you want to make changes,
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
        <Link to={"/admin/nodes/create/blocknumber"}>
          <Button
            disabled={fetchLoading}
            size={"sm"}
            colorScheme={"pink"}
            variant={"outline"}
          >
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
