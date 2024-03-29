import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
  LoaderArgs,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type {
  JobsForm,
  JobsFormData,
  JobsRequest,
  Provider,
} from "~/pkg/jobs/types";
import { job } from "~/pkg/jobs/jobs.server";
import { cronMap } from "../utils/cron-utils";
import shortAddress from "~/utils/short-address";
import capitalize from "../utils/capitalize";
import getProviderName from "../utils/provider-name";
import { errorsMsgMap, errorsRedirectMap } from "../utils/errors";
import { useState } from "react";
import { requireUserId } from "~/session.server";

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

type JobsLen = {
  len: number;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!currentJob) {
    return redirect("/admin/jobs/create/provider");
  }

  const providers = await job.ListProviders();

  // Get jobs len and save in redis (useful for setting the new job name)
  const jobs = await job.ListJobs();
  let jobsLen: JobsLen = { len: jobs.data.length };
  await redis.set("currentNumberOfJobs", jobsLen);

  return json({ data: currentJob, providers: providers.data });
};

export const action = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  // parse form data
  const body = await request.formData();
  console.log("data: ", body);

  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/admin/jobs/create/account");
  }

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
  // Get the node url of the corresponding network
  bodyRequest.nodeUrl = job.networkNodesMap.get(`${current.network}`)!;

  // Get jobs len for assigning the new job name number
  const { len: jobsLen } = (await redis.get("currentNumberOfJobs")) as JobsLen;
  bodyRequest.name = `Job ${jobsLen + 1}`;
  // Delete the jobs len from redis because it will be updated
  await redis.del("currentNumberOfJobs");

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

  // Define state for loaders in the buttons
  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("_action") === "next";
  const isGoingBack = transition.submission?.formData.get("_action") === "back";
  const isCanceling =
    transition.submission?.formData.get("_action") === "cancel";

  // define disabled state for next button and get action data info
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

  let [isRedirecting, setIsRedirecting] = useState(false);
  function handleIsRedirecting() {
    setIsRedirecting(true);
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
            Job info
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
          <Text fontWeight={"bold"} fontSize={"20px"} color={"gray.600"}>
            Confirm information before to create job
          </Text>

          <Text fontWeight={"normal"} fontSize={"18px"} color={"gray.500"}>
            Make sure the contract works correctly so that the calls to the
            methods don't fail. If you wish, you can later modify the job
            parameters.
          </Text>

          <HStack>
            {error !== "" ? (
              <Text colorScheme={"blackAlpha"} color={"red"}>
                {error}
              </Text>
            ) : null}
            {redirect ? (
              <Link to={redirect} onClick={() => handleIsRedirecting()}>
                <Button
                  type="submit"
                  name="_action"
                  value="change"
                  size={"sm"}
                  colorScheme={"pink"}
                  isLoading={isRedirecting}
                >
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
          value="next"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={nextDisabled || isCanceling || isGoingBack}
        >
          CREATE
        </Button>
        <Button
          size={"sm"}
          colorScheme={"pink"}
          variant={"outline"}
          name="_action"
          value="back"
          type="submit"
          isLoading={isGoingBack}
          isDisabled={isCanceling || isSubmitting}
        >
          BACK
        </Button>
        <Button
          size={"sm"}
          colorScheme={"pink"}
          variant={"ghost"}
          type="submit"
          name="_action"
          value="cancel"
          isLoading={isCanceling}
          isDisabled={isGoingBack || isSubmitting}
        >
          Cancel
        </Button>
      </HStack>
    </Form>
  );
}
