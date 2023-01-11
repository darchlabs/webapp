import {
  HStack,
  VStack,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { redis } from "~/pkg/redis/redis.server";
import { useState } from "react";

import PolygoSelectIcon from "~/components/icon/polygon-select-icon";
import Logo from "~/components/icon/logo";
import { useLoaderData, Form } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { job } from "~/pkg/jobs/jobs.server";
import type { ListProvidersResponse } from "~/pkg/jobs/requests";
import { type Network } from "~/types";
import type { JobsFormData } from "~/pkg/jobs/types";

// type LoaderData = {
//   providers: ListProvidersResponse;
//   formData: JobsForm;
// };

export const loader: LoaderFunction = async () => {
  const data = await job.ListProviders();

  // // get current created form data from redis, create if not exists
  // let current = (await redis.get("createdFormData")) as JobsFormData;
  // if (!current) {
  //   return redirect("/admin/jobs/create/provider");
  // }

  return json(data as ListProvidersResponse);
  // return json({ providers: data, formData: current } as LoaderData);
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  const providerId = body.get("provider");
  console.log("form prov: ", providerId);

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    current = {
      providerId: "",
      network: "none",
      address: "",
      abi: "",
      cronjob: "",
      checkMethod: "",
      actionMethod: "",
      privateKey: "",
    };
  }

  console.log("current: ", current);

  // get provider and network values from form and save in redis
  current.providerId = `${providerId}`;
  current.network = body.get("network") as Network;
  await redis.set("createdJobFormData", current);

  console.log("prov, net, :", `${body.get("provider")}`, body.get("network"));

  // redirect to address page
  return redirect(`/admin/jobs/create/address`);
};

export default function StepProvider() {
  const { data } = useLoaderData<ListProvidersResponse>();

  let [providerId, setProviderId] = useState("");
  let [network, setNetwork] = useState("");

  function onProviderClick(providerId: string) {
    setProviderId(providerId);
  }
  function onNetworkClick(network: Network) {
    setNetwork(network);
  }

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
                Select a provider
              </MenuButton>
              <MenuList>
                {data.map((item) => {
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
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Network
            </Text>
            <Menu closeOnSelect={true}>
              <MenuButton as={Button} rightIcon={<PolygoSelectIcon />}>
                Select a network
              </MenuButton>
              <MenuList>
                {data.map((item) =>
                  item.networks.map((network) => {
                    return (
                      <MenuItem
                        key={network}
                        onClick={() => {
                          onNetworkClick(network);
                        }}
                      >
                        {network}
                      </MenuItem>
                    );
                  })
                )}
              </MenuList>
            </Menu>
            <input name={"network"} value={network} type="hidden" />
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
                value={"submit"}
                type="submit"
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
              >
                Cancel
              </Button>
            </HStack>
          </Form>
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <Text color={"GrayText"} fontSize={"25px"}>
          First, select the jobs provider. Then choose the network in which it
          will operate, based on those that it supports.
        </Text>
      </HStack>
    </HStack>
  );
}
