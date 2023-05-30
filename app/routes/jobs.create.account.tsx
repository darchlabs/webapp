import {
  Button,
  Box,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Create, TemplateTitleTwoDescriptionsHint, TextInput } from "@components/create";
import { CreateJobAccountAction, type AccountActionData } from "./jobs.create.account.action";
import { FormName, FormTitle, Steps } from "./jobs.create._index";
import { CreateJobLoader, type LoaderData } from "./jobs.create.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { useEffect } from "react";

export const action: ActionFunction = CreateJobAccountAction;
export const loader: LoaderFunction = CreateJobLoader;

export default function CreateJobAddress() {
  // define hooks
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as AccountActionData;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // define effects
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Create
        title={FormTitle}
        form={FormName}
        steps={Steps}
        currentStep="Configure"
        baseTo="jobs"
        backTo="/jobs/create/cronjob"
        nextTo="confirm"
      >
        <VStack flex={0.4} alignItems={"start"} pr={"10%"}>
          <TextInput
            title={"Private Key"}
            name={"privateKey"}
            value={loaderData?.job?.privateKey}
            form={FormName}
            error={actionData?.privateKey.error}
            placeholder={"0x123456789..."}
          />
        </VStack>
        <Box flex={0.6}>
          <TemplateTitleTwoDescriptionsHint
            title="Enter Your Account's Private Key"
            description1={`Enter your private key without the "0x" prefix to execute the transaction`}
            description2={
              <Text color="pink.400">
                Use a new wallet and only transfer the required amount to pay for the gas fee
              </Text>
            }
            hint={"Hint: Ensure sufficient gas is available on the selected network for a successful transaction"}
          />
        </Box>
      </Create>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnOverlayClick={false} closeOnEsc={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={"pink.400"}>WARNING</ModalHeader>
          <ModalBody>Use a new wallet and only transfer the required amount to pay for the gas fee</ModalBody>

          <ModalFooter>
            <Button colorScheme="pink" mr={3} onClick={onClose}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
