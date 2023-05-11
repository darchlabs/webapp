import { VStack, Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Create, TemplateTitleDescriptionHint } from "@components/create";
import { CreateJobConfirmAction, type ConfirmActionData } from "./jobs.create.confirm.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./jobs.create.loader";
import { ShortAddress } from "@utils/short-address";
import { CreateJobConfirmLoader } from "./jobs.create.confirm.loader";
import { CronjobValues } from "@utils/jobs-cron-utils";
import { ToMap } from "@utils/to-map";

export const action: ActionFunction = CreateJobConfirmAction;
export const loader: LoaderFunction = CreateJobConfirmLoader;

export default function CreateJobConfirm() {
  const {
    job: { name, providerId, network, address, cronjob, checkMethod, actionMethod },
    providers,
  } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ConfirmActionData;

  // format cronjob with templates
  let cron = cronjob;
  const cronTemplate = CronjobValues.find((c) => c.value === cron);
  if (cronTemplate) {
    cron = cronTemplate.text;
  }

  const providerName = ToMap(providers)[providerId].name;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Confirm"
      baseTo="jobs"
      backTo="/jobs/create/account"
    >
      <VStack w={"full"} alignItems={"start"} pr={"10%"}>
        <Text color={"blackAlpha.800"} fontSize={"lg"} fontWeight={"semibold"}>
          Job info
        </Text>

        <VStack spacing={1} alignItems={"start"} color={"gray.500"}>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Name:
            </Text>{" "}
            {name}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Provider:
            </Text>{" "}
            {providerName}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Network:
            </Text>{" "}
            <Text as={"span"} textTransform={"capitalize"}>
              {network}
            </Text>
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Address:{" "}
            </Text>
            {ShortAddress(address)}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Cronjob:{" "}
            </Text>
            {cron}
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Check Method:{" "}
            </Text>
            {checkMethod}()
          </Text>
          <Text>
            <Text as={"span"} fontWeight={"bold"}>
              Action Method:{" "}
            </Text>
            {actionMethod}()
          </Text>
        </VStack>

        {actionData?.confirm?.error ? (
          <Text color={"red.500"} textTransform={"capitalize"}>
            {actionData?.confirm?.error}
          </Text>
        ) : null}
      </VStack>

      <>
        <TemplateTitleDescriptionHint
          title="Confirm information before to create job"
          description="Make sure the contract works correctly so that the calls to the methods don't fail. If you wish, you can later modify the job parameters"
        />
      </>
    </Create>
  );
}
