import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type {
  JobsForm,
  JobsFormData,
  JobsRequest,
  Provider,
} from "~/pkg/jobs/types";
import { v4 as id } from "uuid";
import { job } from "~/pkg/jobs/jobs.server";
import { cronMap } from "../utils/cron-utils";
import shortAddress from "~/utils/short-address";
import capitalize from "../utils/capitalize";
import getProviderName from "../utils/provider-name";
import { errorsMsgMap, errorsRedirectMap } from "../utils/errors";

type actionData =
  | {
      errorMsg: string | undefined;
      job: JobsForm;
      redirectPath: string | undefined;
    }
  | undefined;

type loaderData = {
  data: JobsFormData;
  providers: Provider[];
};

export const loader: LoaderFunction = async () => {
  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  const providers = await job.ListProviders();

  return json({ data: currentJob, providers: providers.data });
};

export const action = async ({ request }: ActionArgs) => {
  // parse form data
  const body = await request.formData();
  console.log("data: ", body);

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }

  // Make the request for creating the job with the data
  const bodyRequest = current as JobsRequest;

  bodyRequest.type = "cronjob";
  bodyRequest.name = id();
  // Get the node url of the corresponding network
  bodyRequest.nodeUrl = job.networkNodesMap.get(`${current.network}`)!;

  // Create job
  const res = await job.CreateJob(bodyRequest);
  console.log("res.meta.statusCode: ", res.meta);
  if (res.meta === 200) {
    // Clean the from after getting it
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  if (typeof res.data === "string") {
    const redirectPath = errorsRedirectMap.get(res.data);
    const errorMsg = errorsMsgMap.has(res.data)
      ? errorsMsgMap.get(res.data)
      : res.data;
    const job = (await redis.get("createdJobFormData")) as JobsFormData;
    return json<actionData>({ errorMsg, job, redirectPath });
  }
};

export default function StepConfirm() {
  const { data, providers } = useLoaderData() as loaderData;
  console.log("data: ", data);

  const actionData = useActionData() as actionData;

  let nextDisabled = false;
  let error = "";
  let redirect = "";

  if (actionData?.errorMsg) {
    error = actionData.errorMsg;

    if (actionData.redirectPath) {
      redirect = actionData.redirectPath;
    }

    if (`${data}` == `${actionData.job}`) {
      nextDisabled = true;
    }
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
                Provider:
              </Text>
              {" " + getProviderName(providers, data.providerId)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network:
              </Text>
              {" " + capitalize(data.network)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Address:
              </Text>
              {" " + shortAddress(data.address)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Cron:
              </Text>
              {" " +
                (cronMap.has(data.cronjob)
                  ? cronMap.get(data.cronjob)
                  : data.cronjob)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Check method:
              </Text>
              {" " + data.checkMethod + "()"}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Action method:
              </Text>
              {" " + data.actionMethod + "()"}
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

          <HStack>
            {error !== "" ? (
              <Text colorScheme={"blackAlpha"} color={"red"}>
                {error}
              </Text>
            ) : null}
            {redirect ? (
              <Link to={redirect}>
                <Button size={"sm"} colorScheme={"pink"}>
                  Change
                </Button>
              </Link>
            ) : null}
          </HStack>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
          isDisabled={nextDisabled}
        >
          CREATE
        </Button>
        <Link to={"/admin/jobs/create/account"}>
          <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
            BACK
          </Button>
        </Link>
        <Button
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
