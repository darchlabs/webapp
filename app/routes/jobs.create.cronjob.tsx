import { Box, VStack } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint } from "@components/create";
import { CreateJobCronjobAction, type CronjobActionData } from "./jobs.create.cronjob.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { SelectCustomInput } from "@components/create/inputs/select-custom-input";
import { CronjobValues } from "@utils/jobs-cron-utils";

export const action: ActionFunction = CreateJobCronjobAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobCronjob() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as CronjobActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/methods"
      nextTo="account"
    >
      <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
        <SelectCustomInput
          name="cronjob"
          title="Cronjob"
          placeholderSelect={"Select Cronjob"}
          placeholderInput={"* * * * * *"}
          value={loaderData?.job?.cronjob}
          form={FormName}
          error={actionData?.cronjob.error}
          customText="Custom Cronjob"
          values={CronjobValues}
        />
      </VStack>
      <Box flex={0.6}>
        <TemplateTitleDescriptionHint
          title="Select or insert the cron"
          description="The cron is responsible of defining the invterval for triggering the contract methods calls"
          hint={
            "Hint: For understanding more about cron, see the crontab.guru for getting more examples or see the official definition"
          }
        />
      </Box>
    </Create>
  );
}
