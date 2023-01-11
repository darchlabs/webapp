import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
<<<<<<< HEAD
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
=======
import { Form, Link, useLoaderData } from "@remix-run/react";
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
<<<<<<< HEAD
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
=======
import type { JobsFormData, JobsRequest } from "~/pkg/jobs/types";
import { v4 as id } from "uuid";
import { job } from "~/pkg/jobs/jobs.server";

export const loader: LoaderFunction = async () => {
  const currentJob = await redis.get("createdJobFormData");
  return json(currentJob as JobsFormData);
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
};

export const action = async ({ request }: ActionArgs) => {
  // parse form data
  const body = await request.formData();
<<<<<<< HEAD
  console.log("data: ", body);
=======
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
<<<<<<< HEAD
    return redirect("/admin/jobs/create/provider");
=======
    return redirect("/admin/jobs/create/network");
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  }

  // Make the request for creating the job with the data
  const bodyRequest = current as JobsRequest;

<<<<<<< HEAD
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

=======
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
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
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
<<<<<<< HEAD
            Job info
=======
            Jobs info
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
          </Text>

          <VStack
            alignItems={"start"}
            color={"gray.500"}
            fontSize={"14px"}
            spacing={"2px"}
          >
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
<<<<<<< HEAD
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
=======
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
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
            </Text>
          </VStack>
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
<<<<<<< HEAD
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
              <Link to={redirect}>
                <Button size={"sm"} colorScheme={"pink"}>
                  Change
                </Button>
              </Link>
            ) : null}
          </HStack>
=======
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            Confirm information before to create syncronizer
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            Remember you can't change information about the synchronizer
            afterwards, so if you want to make changes, you'll need to delete it
            first and then create a new one.
          </Text>
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
<<<<<<< HEAD
=======
          //   isLoading={fetchLoading}
          //   disabled={fetchLoading}
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
          size={"sm"}
          colorScheme={"pink"}
          name="_action"
          value="submit"
          type="submit"
<<<<<<< HEAD
          isDisabled={nextDisabled}
        >
          CREATE
        </Button>
        <Link to={"/admin/jobs/create/account"}>
=======
        >
          CREATE
        </Button>
        <Link to={"/admin/jobs/create/privateKey"}>
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
          <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
            BACK
          </Button>
        </Link>
        <Button
<<<<<<< HEAD
=======
          //   disabled={fetchLoading}
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
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
