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
import { synchronizers } from "darchlabs";
import { useFetcher, useLocation } from "@remix-run/react";
import { type EditContractActionData } from "@routes/synchronizers.edit.action";

export function EditContractModal({
  contract,
  isOpen,
  onClose,
}: {
  contract: synchronizers.Contract;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(contract.name);
  const [nodeURL, setNodeURL] = useState(contract.nodeURL);
  const [webhook, setWebhoook] = useState(contract.webhook || "");
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
    formData.append("network", contract.network);
    formData.append("address", contract.address);
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
    setName(contract.name);
    setNodeURL(contract.nodeURL);
    setWebhoook(contract.webhook || "");
    setError("");
    setIsLoading(false);
    onClose();
  }, [contract.name, contract.nodeURL, contract.webhook, onClose]);

  // check if fetched is resolved and has data
  useEffect(() => {
    if (fetcher.state === "loading") {
      const actionData = fetcher.data as EditContractActionData;
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
        <ModalHeader>Edit Contract</ModalHeader>
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
