import { VStack, Text } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleTwoDescriptionsHint, SelectInput, type SelectInputValue } from "@components/create";
import { CreateJobMethodsAction, type MethodsActionData } from "./jobs.create.methods.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { type Abi } from "darchlabs";

export const action: ActionFunction = CreateJobMethodsAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobMethods() {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as MethodsActionData;

  // // TODO(ca): validate abi is defined in loader
  const abi = JSON.parse(loaderData.job.abi) as Abi[];

  const [viewsMethods, actionsMethods] = abi.reduce(
    (methods, item) => {
      if (item.type === "function") {
        // check if view method
        if (item.stateMutability === "view" && item.outputs![0]?.internalType === "bool") {
          methods[0].push({
            text: `${item.name}()`,
            value: item.name,
          });
        } else if (item.stateMutability === "nonpayable") {
          methods[1].push({
            text: `${item.name}()`,
            value: item.name,
          });
        }
      }

      return methods;
    },
    [[], []] as [SelectInputValue[], SelectInputValue[]]
  );

  return (
    <Create
      title={FormTitle}
      form={FormName}
      steps={Steps}
      currentStep="Configure"
      baseTo="jobs"
      backTo="/jobs/create/abi"
      nextTo="cronjob"
    >
      <VStack w={"full"} alignItems={"start"} pr={"10%"}>
        <SelectInput
          name={"checkMethod"}
          title={"Check Method"}
          placeholder="Select check method"
          form={FormName}
          value={loaderData?.job?.checkMethod}
          error={actionData?.checkMethod?.error}
          values={viewsMethods}
        />
        <SelectInput
          name={"actionMethod"}
          title={"Action Method"}
          placeholder="Select action method"
          form={FormName}
          value={loaderData?.job?.actionMethod}
          error={actionData?.actionMethod?.error}
          values={actionsMethods}
        />
      </VStack>

      <>
        <TemplateTitleTwoDescriptionsHint
          title="Select the methods to call in the contract."
          description1={
            <>
              <Text fontWeight={"bold"}>Check method:</Text> It's a method responsible of checking if the contract needs
              a call to the action method
            </>
          }
          description2={
            <>
              <Text fontWeight={"bold"}>Action method:</Text> It's a method responsible of doing the action inside the
              contract. Performing this method will spend gas because the execution will change the state of the it
            </>
          }
        />
      </>
    </Create>
  );
}
