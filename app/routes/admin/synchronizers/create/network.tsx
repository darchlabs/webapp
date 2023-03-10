import {
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Show,
  Icon,
  Flex,
  Input,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import type { Network } from "../../../../types";
import EthereumAvatar from "../../../../components/icon/ethereum-avatar";
import PolygonSelectIcon from "../../../../components/icon/polygon-select-icon";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { SynchronizerFormData } from "~/pkg/synchronizer/types";
import { ethers } from "ethers";
import { getChainId } from "~/utils/chain-info";

function getSelectedNetwork(network: Network) {
  if (network === "ethereum") {
    return (
      <HStack>
        <EthereumAvatar borderRadius="full" boxSize={"1.5rem"} />
        <Text as={"span"} textTransform={"capitalize"}>
          Ethereum Mainnet
        </Text>
      </HStack>
    );
  }

  if (network === "polygon") {
    return (
      <HStack>
        <Icon as={PolygonSelectIcon} boxSize={"24px"} />
        <Text as={"span"} textTransform={"capitalize"}>
          Polygon Mainnet
        </Text>
      </HStack>
    );
  }

  return null;
}

type actionData = {
  message: string;
  nodeURL: string;
};

export async function action({ request }: ActionArgs) {
  // parse form data
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdFormData");
    return redirect("/admin/synchronizers");
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
  if (chainId !== getChainId(network.toString().toLowerCase())) {
    return {
      message: "client network doesn't match the given network",
      nodeURL,
    };
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    return redirect("/admin/synchronizers/create/network");
  }

  // get values from form and save in redis
  current.network = network;
  current.nodeURL = nodeURL;
  //TODO: Update node url too
  await redis.set("createdFormData", current);

  // redirect to address page
  return redirect("/admin/synchronizers/create/contract");
}

export const loader: LoaderFunction = async () => {
  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdFormData")) as SynchronizerFormData;
  if (!current) {
    current = {
      network: "none",
      address: "",
      raw: "",
    } as SynchronizerFormData;

    await redis.set("createdFormData", current);
  }

  return json(current);
};

export default function StepNetwork() {
  const formData = useLoaderData<SynchronizerFormData>();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [network, setNetwork] = useState(formData.network);
  const [nodeURL, setNodeURL] = useState("");

  function onClick(network: Network) {
    setNetwork(network);
  }

  function onInputNodeURL(nodeURL: string) {
    setNodeURL(nodeURL);
  }

  let isDisabled = false;

  const error = useActionData() as actionData;
  if (error?.nodeURL === nodeURL) {
    isDisabled = true;
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
          <HStack justifyContent={"start"} mb={"2px"}>
            <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
              Network
            </Text>
          </HStack>

          <Menu id="lolo">
            <MenuButton
              as={Button}
              rightIcon={<BsChevronDown />}
              px={4}
              py={2}
              bg={"white"}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              textAlign={"left"}
              color={"gray.500"}
              size={"lg"}
              justifyContent={"start"}
              alignItems={"center"}
            >
              {network === "none" ? (
                <Text as={"span"}>Select a network</Text>
              ) : (
                getSelectedNetwork(network)
              )}
            </MenuButton>
            <MenuList>
              <MenuItem minH="48px" onClick={() => onClick("ethereum")}>
                <EthereumAvatar
                  mr="12px"
                  borderRadius="full"
                  boxSize={"1.5rem"}
                />
                <span>Ethereum Mainnet</span>
              </MenuItem>
              <MenuItem minH="48px" onClick={() => onClick("polygon")}>
                <Icon as={PolygonSelectIcon} mr="12px" boxSize={"24px"} />
                <span>Polygon Mainnet</span>
              </MenuItem>
            </MenuList>
          </Menu>
          <input type="hidden" name="network" value={network} />
          <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
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
        </VStack>

        <VStack w={["full", "full", "58%"]} alignItems={"start"}>
          <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
            First, insert the contract network.
          </Text>

          <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
            The contract must already be implemented in the chosen network.
          </Text>

          <Show above="md">
            <Text
              fontWeight={"normal"}
              fontSize={"12px"}
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
              : For now we are only accepting contracts on Ethereum and Polygon.
              Check the{" "}
              <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
                Roadmap
              </Text>{" "}
              to know the following networks.
            </Text>
          </Show>
        </VStack>
      </Flex>

      <HStack w={"full"} justifyContent={"start"} pt={"12px"} spacing={"10px"}>
        <Button
          isLoading={fetchLoading}
          disabled={network === "none" || fetchLoading || isDisabled}
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
          disabled={fetchLoading}
          size={"sm"}
          colorScheme={"pink"}
          variant={"ghost"}
          type="submit"
        >
          Cancel
        </Button>
      </HStack>
    </Form>
  );
}
