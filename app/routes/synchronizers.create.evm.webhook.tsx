import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleDescriptionHint, TextInput } from "@components/create";
import { CreateSynchronizersEvmWebhookAction, type WebhookActionData } from "./synchronizers.create.evm.webhook.action";
import { FormName, FormTitle, Steps } from "./synchronizers.create._index";
import { CreateSynchronizersEvmLoader } from "./synchronizers.create.evm._index";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type LoaderData } from "./synchronizers.create.evm._index";
import { synchronizers } from "darchlabs";

export const action: ActionFunction = CreateSynchronizersEvmWebhookAction;
export const loader: LoaderFunction = CreateSynchronizersEvmLoader;

export default function CreateSynchronizerEvmName() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as WebhookActionData;

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="synchronizers"
      backTo="/synchronizers/create/evm/address"
      nextTo="abi"
      omitTo={"/synchronizers/create/evm/abi"}
    >
      <>
        <TextInput
          title={"Webhook URL"}
          name={"webhook"}
          value={loaderData?.contract?.webhook!}
          form={FormName}
          error={actionData?.webhook.error}
          placeholder={"Webhook URL"}
        />
      </>

      <>
        <TemplateTitleDescriptionHint
          title="Enter the webhook URL"
          description="The URL of the webhook endpoint that will receive the data and notifications"
          hint={
            "Hint: The webhook URL is optional. You can leave it blank for now and modify it later by editing the smartcontract"
          }
        />
      </>
    </Create>
  );
}
