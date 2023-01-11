import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData, JobsRequest } from "~/pkg/jobs/types";
import { v4 as id } from "uuid";
import { job } from "~/pkg/jobs/jobs.server";

export const loader: LoaderFunction = async () => {
  const currentJob = await redis.get("createdJobFormData");
  return json(currentJob as JobsFormData);
};

export const action = async ({ request }: ActionArgs) => {
  // parse form data
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/network");
  }

  // Make the request for creating the job with the data
  const bodyRequest = current as JobsRequest;

  //TODO(nb): Validate the values are right

  bodyRequest.type = "cronjob";
  bodyRequest.name = id();
  // TODO(nb): use node url from nodes
  bodyRequest.nodeUrl =
    "https://eth-goerli.g.alchemy.com/v2/6618jw7mOb14pcAn6K9YdHyx09njK1vU";

  const res = await job.CreateJob(bodyRequest);
  console.log("done");
  console.log("res: ", res);

  //TODO(nb): Delete the redis register after making the request?
  await redis.del("createdJobFormData");

  return redirect("/admin/jobs");
};

export default function StepConfirm() {
  const data = useLoaderData() as JobsFormData;
  console.log("data: ", data);
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
            Jobs info
          </Text>

          <VStack
            alignItems={"start"}
            color={"gray.500"}
            fontSize={"14px"}
            spacing={"2px"}
          >
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
              : {"addr"}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Event name
              </Text>
              : {"abi.name"}
            </Text>
          </VStack>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Confirm information before to create syncronizer
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            Remember you can't change information about the synchronizer
            afterwards, so if you want to make changes, you'll need to delete it
            first and then create a new one.
          </Text>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          //   isLoading={fetchLoading}
          //   disabled={fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
        >
          CREATE
        </Button>
        <Link to={"/admin/jobs/create/privateKey"}>
          <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
            BACK
          </Button>
        </Link>
        <Button
          //   disabled={fetchLoading}
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
