import { HStack, VStack, Text, Textarea, Link, Show } from "@chakra-ui/react";

import Ajv from "ajv";
import type { Abi } from "../../types";

const AbiSchema = {
  type: "object",
  properties: {
    anonymous: { type: "boolean" },
    name: { type: "string" },
    type: { type: "string" },
    inputs: { type: "array" },
  },
  required: ["anonymous", "name", "type", "inputs"],
  additionalProperties: false,
};

const AbiInputSchema = {
  type: "object",
  properties: {
    indexed: { type: "boolean" },
    internalType: { type: "string" },
    name: { type: "string" },
    type: { type: "string" },
  },
  required: ["anonymous", "name", "type", "inputs"],
  additionalProperties: false,
};

export type AbiForm = {
  raw: string;
  data: Abi;
  valid: boolean;
};

export default function StepAbi(abi: AbiForm, setAbi: (abi: AbiForm) => void) {
  const ajv = new Ajv();

  function onChange({ target: { value } }: { target: { value: string } }) {
    // validate json
    let valid: boolean = true;

    let parsedJSON: Abi = {} as Abi;
    try {
      console.log("before");
      // check and parse json from string to object
      parsedJSON = JSON.parse(value) as Abi;
      console.log("after");

      // check is object and is an event input
      if (Array.isArray(parsedJSON) || parsedJSON == null) {
        throw new Error("JSON is not a valid object");
      }

      // check if json abi schema is valid
      {
        const validate = ajv.compile(AbiSchema);
        const valid = validate(parsedJSON);
        if (!valid) {
          console.log("ERROR", validate.errors);
          throw new Error("Invalid JSON schema for ABI");
        }
      }

      // check if abi input is an event
      if (parsedJSON.type !== "event") {
        throw new Error("ABI has not event key");
      }

      // check abi input len > 0
      if (!parsedJSON.inputs.length) {
        throw new Error("ABI has not inputs values");
      }

      // iterate input and check each has a valid abi input schema
      {
        const validate = ajv.compile(AbiInputSchema);
        for (let i = 0; i > parsedJSON.inputs.length; i++) {
          const input = parsedJSON.inputs[i];
          const valid = validate(input);
          if (!valid) {
            throw new Error(`Invalid JSON schema for ABI.Input index=${i}`);
          }
        }
      }
    } catch (err: any) {
      valid = false;
    }

    setAbi({
      raw: value,
      data: parsedJSON,
      valid,
    });
  }

  return (
    <>
      <VStack w={["full", "full", "36%"]} alignItems="stretch">
        <HStack justifyContent={"space-between"} mt={"10px"} mb={"2px"}>
          <Text fontWeight={"semibold"} fontSize={"16px"} color={"#9FA2B4"}>
            Event ABI
          </Text>
          {/* <Text fontWeight={"normal"} fontSize={"14px"} color={"#ED64A6"} borderBottom={"1px dotted #ED64A6"}>
            My addresses
          </Text> */}
        </HStack>

        <Textarea
          value={abi.raw}
          onChange={onChange}
          fontSize={"12px"}
          size={"md"}
          placeholder='{"anonymous": boolean, "inputs": Input[], "name": string, "type": "event"}'
        ></Textarea>
      </VStack>

      <VStack w={["full", "full", "58%"]} alignItems={"start"}>
        <Text fontWeight={"bold"} fontSize={"16px"} color={"gray.600"}>
          Third, insert the event ABI of the event.
        </Text>

        <Text fontWeight={"normal"} fontSize={"14px"} color={"gray.500"}>
          Remember that if your contract is not verified, you will have to enter the ABI manually, inserting only the
          object related to the event you want to sync.
        </Text>

        <Show above="md">
          <Text fontWeight={"normal"} fontSize={"12px"} color={"gray.500"} pt={"15px"}>
            <Text as="span" fontWeight={"bold"} borderBottom={"1px dotted #9FA2B4"}>
              Hint
            </Text>
            : to verify the contract you can see the{" "}
            <Text as="span" fontWeight={"bold"} color={"#ED64A6"}>
              <Link href="https://ethereum.org/en/developers/docs/smart-contracts/verifying/" isExternal>
                follow guide
              </Link>
            </Text>
            . Check our{" "}
            <Text as="span" fontWeight={"bold"}>
              Roadmap
            </Text>{" "}
            to find out when we will implement contract verification in the admin panel.
          </Text>
        </Show>
      </VStack>
    </>
  );
}
