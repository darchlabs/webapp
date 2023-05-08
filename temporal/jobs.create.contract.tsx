import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { type ActionArgs, redirect, json, type LoaderFunction } from "@remix-run/node";
import { redis } from "@models/redis.server";
import type { JobsFormData } from "@models/jobs/types";
import react from "react";
// import { ethers, utils } from "ethers";

type loaderData = {
  currentJob: JobsFormData;
};

export const loader: LoaderFunction = async () => {
  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!currentJob) {
    return redirect("/jobs/create/provider");
  }

  return json<loaderData>({ currentJob });
};

type actionData =
  | {
      message: string;
      address: string;
      abi: string;
    }
  | undefined;

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/jobs/create/provider");
  }

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/jobs/create");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/jobs/create/provider");
  }

  // Get inputs
  const contractAddress = `${body.get("address")}`;
  const contractAbi = `${body.get("abi")}`;

  // Get the network chain id and instance the client provider with it
  // const network = current.network;
  // const chainId = getChainId(network.toLowerCase());
  // const provider = ethers.getDefaultProvider(chainId);

  // // Check the address format is valid
  // if (!utils.isAddress(contractAddress)) {
  //   return json<actionData>({
  //     message: `The address format is invalid`,
  //     address: contractAddress,
  //     abi: contractAbi,
  //   });
  // }

  
  // // Check if the address exists on the network
  // const code = await provider.getCode(contractAddress);
  // if (code === "0x") {
  //   return json<actionData>({
  //     message: `The address is not deployed on the ${network} network`,
  //     address: contractAddress,
  //     abi: contractAbi,
  //   });
  // }

  // try {
  //   // Validate the contract abi format is correct by instancing it
  //   new ethers.Contract(contractAddress, contractAbi, provider);
  // } catch (err) {
  //   const error = new Error(`${err}`);
  //   return json<actionData>({
  //     message: error.message,
  //     address: contractAddress,
  //     abi: contractAbi,
  //   });
  // }

  // get provider and network values from form and save in redis
  current.address = contractAddress;
  current.abi = contractAbi;
  await redis.set("createdJobFormData", current);

  // redirect to cronjob page
  return redirect(`/jobs/create/methods`);
};

export default function StepAddress() {
  const { currentJob } = useLoaderData() as loaderData;
  const currentAddress = currentJob.address ? currentJob.address : "";
  const currentAbi = currentJob.abi ? currentJob.abi : "";

  // Define the input variables and their state react hook
  let [address, setAddress] = react.useState(currentAddress);
  let [abi, setAbi] = react.useState(currentAbi);

  function onInputAddress(address: string) {
    setAddress(address);
  }

  function onInputAbi(abi: string) {
    setAbi(abi);
  }

  const transition = useTransition();
  const isSubmitting = transition.submission?.formData.get("_action") === "next";
  const isGoingBack = transition.submission?.formData.get("_action") === "back";
  const isCanceling = transition.submission?.formData.get("_action") === "cancel";

  // Define is disabled for disabling the NEXT button
  let isDisabled = false;

  // Check if the inputs are the same than thoshe which were bad, in that case, NEXT should be disabled
  const error = useActionData() as actionData;
  if (error?.abi === abi && error?.address === address) {
    isDisabled = true;
  }

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Contract address
            </Text>
            <Input
              name="address"
              type="text"
              placeholder="0x..."
              width={"440px"}
              defaultValue={currentAddress}
              onChange={(event) => {
                onInputAddress(event.target.value);
              }}
            />
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Contract ABI
            </Text>
            <Input
              name="abi"
              type="text"
              placeholder="`['abi: ...]`"
              width={"440px"}
              defaultValue={currentAbi}
              onChange={(event) => {
                onInputAbi(event.target.value);
              }}
            />
            <HStack>
              {error ? <Text color={"red.400"}>The contract doesn't exist for the given address and abi.</Text> : null}
            </HStack>
            <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
              <Button
                size={"sm"}
                colorScheme={"pink"}
                name={"_action"}
                value={"next"}
                type="submit"
                disabled={address === "" || abi === "" || isDisabled || isCanceling || isGoingBack}
                isLoading={isSubmitting}
              >
                NEXT
              </Button>
              <Button
                size={"sm"}
                colorScheme={"pink"}
                variant={"outline"}
                name={"_action"}
                type="submit"
                value={"back"}
                isLoading={isGoingBack}
                isDisabled={isSubmitting || isCanceling}
              >
                BACK
              </Button>
              <Button
                name={"_action"}
                value={"cancel"}
                size={"sm"}
                colorScheme={"pink"}
                variant={"ghost"}
                type="submit"
                isLoading={isCanceling}
                isDisabled={isSubmitting || isGoingBack}
              >
                Cancel
              </Button>
            </HStack>
          </Form>
        </VStack>
      </HStack>

      <HStack justifyContent={"rigth"} w={"full"} alignItems={"start"}>
        <Text fontSize={"20px"}>Second, insert the address and the ABI of the contract.</Text>
      </HStack>
    </HStack>
  );
}
