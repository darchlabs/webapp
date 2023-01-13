import { HStack, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type {
  Job,
  JobsFormData,
  JobsRequest,
  Provider,
} from "~/pkg/jobs/types";
import { v4 as id } from "uuid";
import { job } from "~/pkg/jobs/jobs.server";
import { cronMap } from "./cron";
import JobsTable from "~/components/jobs-table/table";

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
  // Clean the from after getting it
  await redis.del("createdJobFormData");

  //TODO(nb): Validate the values are right
  bodyRequest.type = "cronjob";
  bodyRequest.name = id();
  // TODO(nb): use node url from nodes or env
  bodyRequest.nodeUrl =
    "https://eth-goerli.g.alchemy.com/v2/6618jw7mOb14pcAn6K9YdHyx09njK1vU";

  const res = await job.CreateJob(bodyRequest);
  console.log("res: ", res);
  if (res.meta.statusCode === 200) {
    return redirect("/admin/jobs");
  }

  // TODO(nb): it has to render the failed (but not created) job in the table and don't redirect
  // <JobsTable items={[bodyRequest as Job]} />;
  return redirect("/admin/jobs");
};

export default function StepConfirm() {
  const { data, providers } = useLoaderData() as loaderData;
  console.log("data: ", data);

  function getProvider(providerId: string): string {
    let providerName = "";
    providers.map((provider) => {
      if (provider.id === providerId) {
        providerName = provider.name;
      }
      return providerName;
    });
    return providerName;
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
              {" " + getProvider(data.providerId)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Network:
              </Text>
              {" " + data.network}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Address:
              </Text>
              {" " + data.address}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Cron:
              </Text>
              {" " +
                (cronMap[data.cronjob] ? cronMap[data.cronjob] : data.cronjob)}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Check method:
              </Text>
              {" " + data.checkMethod}
            </Text>
            <Text fontWeight={"semibold"}>
              <Text as={"span"} fontWeight={"bold"}>
                Action method:
              </Text>
              {" " + data.actionMethod}
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
        <Link to={"/admin/jobs/create/account"}>
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
