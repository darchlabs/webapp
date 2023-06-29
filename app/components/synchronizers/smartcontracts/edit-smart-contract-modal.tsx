import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { type SmartContract } from "darchlabs";
import { useFetcher, useLocation } from "@remix-run/react";
import { type EditSmartContractActionData } from "@routes/synchronizers.edit.action";

export function EditSmartContractModal({
  smartcontract,
  isOpen,
  onClose,
}: {
  smartcontract: SmartContract;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(smartcontract.name);
  const [nodeURL, setNodeURL] = useState(smartcontract.nodeURL);
  const [webhook, setWebhoook] = useState(smartcontract.webhook || "");
  const [error, setError] = useState("");

  const { pathname, search } = useLocation();
  const fetcher = useFetcher();

  function handleOnClick() {
    // show loading button and clean error
    setIsLoading(true);
    setError("");

    // prepare data to send in the form
    const formData = new FormData();
    formData.append("redirectURL", `${pathname}${search}`);
    formData.append("network", smartcontract.network);
    formData.append("address", smartcontract.address);
    formData.append("name", name);
    formData.append("nodeURL", nodeURL);
    formData.append("webhook", webhook);

    // send form to delete event action
    fetcher.submit(formData, {
      method: "post",
      action: `/synchronizers/edit/action`,
    });
  }

  function isReady() {
    return !name.length || !nodeURL.length ? false : true;
  }

  const handleOnClose = useCallback(() => {
    setName(smartcontract.name);
    setNodeURL(smartcontract.nodeURL);
    setWebhoook(smartcontract.webhook || "");
    setError("");
    setIsLoading(false);
    onClose();
  }, [smartcontract.name, smartcontract.nodeURL, smartcontract.webhook, onClose]);

  // check if fetched is resolved and has data
  useEffect(() => {
    if (fetcher.state === "loading") {
      const actionData = fetcher.data as EditSmartContractActionData;
      // check if action data has error
      if (actionData?.error) {
        setIsLoading(false);
        setError(actionData.error);
        return;
      }

      setError("");
      setIsLoading(false);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit SmartContract</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl colorScheme="pink">
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" value={name} onChange={(ev) => setName(ev.target.value)} />
          </FormControl>

          <FormControl mt={4} colorScheme="pink">
            <FormLabel>Node URL</FormLabel>
            <Input placeholder="Node URL" value={nodeURL} onChange={(ev) => setNodeURL(ev.target.value)} />
          </FormControl>

          <FormControl mt={4} colorScheme="pink">
            <FormLabel>Webhook URL</FormLabel>
            <Input placeholder="Webhook URL" value={webhook} onChange={(ev) => setWebhoook(ev.target.value)} />
          </FormControl>

          {error != "" ? (
            <Text color={"red.500"} mt={4}>
              {error}
            </Text>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="pink" mr={3} isLoading={isLoading} onClick={handleOnClick} disabled={!isReady()}>
            Update
          </Button>
          <Button onClick={handleOnClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
