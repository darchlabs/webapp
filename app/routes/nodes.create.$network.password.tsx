import {
  Button,
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
import { CreateNodePasswordAction, type PasswordActionData } from "./nodes.create.$network.password.action";
import { FormName, FormTitle, Steps } from "./nodes.create._index";
import { CreateNodeLoader, type LoaderData } from "./nodes.create.$network.loader";
import { useLoaderData, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { type NodesCeloNE } from "darchlabs";

export const action: ActionFunction = CreateNodePasswordAction;
export const loader: LoaderFunction = CreateNodeLoader;

export default function () {
  // define hooks
  const loaderData = useLoaderData() as LoaderData<NodesCeloNE>;
  const actionData = useActionData() as PasswordActionData;
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
        baseTo="nodes"
        backTo="/nodes/create/network"
      >
        <>
          <TextInput
            title={"Password"}
            name={"password"}
            value={loaderData?.input?.envVars?.PASSWORD}
            form={FormName}
            error={actionData?.password.error}
            placeholder={"Insert password"}
          />
        </>

        <>
          <TemplateTitleTwoDescriptionsHint
            title="Enter your password"
            description1={
              "Create a strong password and keep it confidential. It provides access to information from the Celo node."
            }
            description2={
              "The password is permanent and cannot be changed. If lost or changed, the node must be deleted and recreated."
            }
            hint={"Your password should be at least 12 characters long"}
          />
        </>
      </Create>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnOverlayClick={false} closeOnEsc={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={"pink.400"}>WARNING</ModalHeader>
          <ModalBody>
            <Text>
              Create a strong password and keep it confidential. It provides access to information from the Celo node
            </Text>
          </ModalBody>

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
