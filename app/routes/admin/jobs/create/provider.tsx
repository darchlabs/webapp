import {
  HStack,
  VStack,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Show,
  Input,
} from "@chakra-ui/react";
import { redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import react from "react";

import PolygoSelectIcon from "~/components/icon/polygon-select-icon";
import Logo from "~/components/icon/logo";
import {
  useLoaderData,
  Form,
  useTransition,
  useActionData,
} from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "~/pkg/jobs/jobs.server";
import { type Network } from "~/types";
import type { JobsFormData, Provider } from "~/pkg/jobs/types";
import capitalize from "../utils/capitalize";
import { getChainId } from "~/utils/chain-info";
import { ethers } from "ethers";

type loaderData = {
  providers: Provider[];
  currentJob: JobsFormData;
};

type actionData = {
  message: string;
  nodeURL: string;
};

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  let currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!currentJob) {
    currentJob = {
      providerId: "",
      network: "none",
      address: "",
      abi: "",
      cronjob: "",
      checkMethod: "",
      actionMethod: "",
      privateKey: "",
    } as JobsFormData;

    await redis.set("createdJobFormData", currentJob);
  }

  // Get and return the list of jobs providers from the Jobs api
  const providers = await job.ListProviders();
  return json<loaderData>({ providers: providers.data, currentJob });
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  const nodeURL = `${body.get("nodeURL")}`;
  // Get client
  const client = new ethers.providers.JsonRpcProvider(nodeURL);
  try {
    await client.getNetwork();
  } catch (err: any) {
    return { message: "invalid client", nodeURL };
  }

  // Validate client works
  let chainId = 0;
  try {
    const clientNet = await client.getNetwork();
    chainId = clientNet.chainId;
  } catch (err: any) {
    return { message: err, nodeURL };
  }
  if (!chainId || chainId === 0) {
    return { message: "invalid client", nodeURL };
  }

  // Validate client network
  const network = `${body.get("network")}`.toLowerCase() as Network;
  if (chainId !== getChainId(network)) {
    return {
      message: "client network doesn't match the given network",
      nodeURL,
    };
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;

  // get provider and network values from form, then format and save them in redis
  current.nodeURL = nodeURL;
  current.network = network;
  current.providerId = `${body.get("provider")}`;

  await redis.set("createdJobFormData", current);

  // redirect to address page
  return redirect(`/admin/jobs/create/contract`);
};

export default function StepProvider() {
  const { providers, currentJob } = useLoaderData<loaderData>();
  let currentProviderId = currentJob.providerId ? currentJob.providerId : "";
  let currentNetwork =
    currentJob.network !== "none" ? `${currentJob.network}` : "";

  let [providerId, setProviderId] = react.useState(currentProviderId);
  let [network, setNetwork] = react.useState(currentNetwork);
  let [nodeURL, setNodeURL] = react.useState("");

  let provider = providers.find((item) => item.id === providerId);

  function onProviderClick(providerId: string) {
    setProviderId(providerId);
  }

  function onNetworkClick(network: Network) {
    setNetwork(capitalize(network));
  }

  function onInputNodeURL(nodeURL: string) {
    setNodeURL(nodeURL);
  }

  let isDisabled = false;

  const error = useActionData() as actionData;
  if (error?.nodeURL === nodeURL) {
    isDisabled = true;
  }

  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("_action") === "next";
  const isCanceling =
    transition.submission?.formData.get("_action") === "cancel";

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Text fontSize={"20px"} color={"ActiveBorder"}>
            Provider
          </Text>
          <Form method="post">
            <Menu closeOnSelect={true}>
              <MenuButton
                id={"ok"}
                as={Button}
                rightIcon={<PolygoSelectIcon />}
              >
                {provider ? provider.name : "Select a provider"}
              </MenuButton>
              <MenuList>
                {providers.map((item) => {
                  let isDisabled: boolean;
                  // TODO: update logo based on the provider id
                  return (
                    <li key={item.id}>
                      <HStack>
                        {(isDisabled = item.networks.length < 1)}
                        <MenuItem
                          isDisabled={isDisabled}
                          onClick={() => {
                            onProviderClick(item.id);
                          }}
                          icon={<Logo />}
                        >
                          {item.name}
                        </MenuItem>
                        <input
                          name="provider"
                          type="hidden"
                          value={providerId}
                        />
                      </HStack>
                    </li>
                  );
                })}
              </MenuList>
            </Menu>
            <Text fontSize={"20px"} color={"ActiveBorder"} paddingTop={"3"}>
              Network
            </Text>
            <Menu closeOnSelect={true}>
              <MenuButton as={Button} rightIcon={<PolygoSelectIcon />}>
                {network !== "" ? network : "Select a network"}
              </MenuButton>
              <MenuList>
                {providers.map((item) =>
                  item.networks.map((network) => {
                    return (
                      <MenuItem
                        key={network}
                        defaultValue={network}
                        onClick={() => {
                          onNetworkClick(network);
                        }}
                      >
                        {network[0].toUpperCase() + network.substring(1)}
                      </MenuItem>
                    );
                  })
                )}
              </MenuList>
            </Menu>
            <input name={"network"} value={network} type="hidden" />

            <Text fontSize={"20px"} color={"ActiveBorder"} paddingTop={"3"}>
              Node Provider URL
            </Text>
            <Input
              name="nodeURL"
              type="text"
              placeholder="`node url ...`"
              defaultValue={nodeURL}
              onChange={(event) => {
                onInputNodeURL(event.target.value);
              }}
            />
            <HStack>
              {error ? <Text color={"red.400"}>{error.message}</Text> : null}
            </HStack>
            <HStack
              w={"full"}
              justifyContent={"start"}
              pt={"12px"}
              spacing={"10px"}
            >
              <Button
                size={"sm"}
                colorScheme={"pink"}
                name={"_action"}
                value={"next"}
                type="submit"
                isLoading={isSubmitting}
                disabled={
                  providerId === "" ||
                  network === "none" ||
                  isCanceling ||
                  isDisabled
                }
              >
                NEXT
              </Button>
              <Button
                name={"_action"}
                value={"cancel"}
                size={"sm"}
                colorScheme={"pink"}
                variant={"ghost"}
                type="submit"
                isLoading={isCanceling}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            </HStack>
          </Form>
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <VStack alignItems={"start"}>
          <Text>
            <Text fontSize={"20px"}>
              First, select the jobs provider. Then, choose the network in which
              it will operate, based on those that it supports.
            </Text>
            <Text color={"GrayText"} fontSize={"18px"}>
              The contract must already be deployed on the provider's choosen
              network.
            </Text>
          </Text>
          <Show above="md">
            <Text
              fontWeight={"normal"}
              fontSize={"14px"}
              color={"gray.500"}
              pt={"15px"}
            >
              <Text
                as="span"
                fontWeight={"bold"}
                borderBottom={"1px dotted #9FA2B4"}
              >
                Hint
              </Text>
              : Check our roadmap to know the next networks we will support for
              providers{" "}
              <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
                Roadmap
              </Text>{" "}
              to know the following networks.
            </Text>
          </Show>
        </VStack>
      </HStack>
    </HStack>
  );
}
