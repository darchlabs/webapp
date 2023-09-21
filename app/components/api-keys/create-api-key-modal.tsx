import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
  HStack,
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
import { useFetcher } from "@remix-run/react";
import { CreateApiKeyActionData } from "@routes/api-keys.create.action";
import { RiFileCopyLine } from "react-icons/ri";

export function CreateApiKeyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const [isFetching, setIsFetching] = useState(false);
  const [days, setDays] = useState(30);
  const [buttonText, setButtonText] = useState("Copy");
  let fetcher = useFetcher();
  let actionData = fetcher.data as CreateApiKeyActionData;

  // handlers
  const handleOnClick = () => {
    setIsFetching(true);
    fetcher.submit({ days: days.toString() }, {
      method: "post",
      action: "/api-keys/create/action",
    });
  }
  const handleOnClose = useCallback(() => {
    setIsFetching(false);
    setDays(30);
    onClose();
  }, [onClose]);

  const copyToClipboardHandler = async () => {
    if (!navigator.clipboard) {
      // Clipboard API not available
      return;
    }
    try {
      await navigator.clipboard.writeText(actionData?.apiKey!);
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // define effects
  useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsFetching(true);
    } else if (fetcher.state === "loading") {
      setIsFetching(false);
    }
  }, [fetcher, isFetching]);

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        {/* modal header */}
        <ModalHeader>Create API Key</ModalHeader>
        <ModalCloseButton />

        {/* modal body */}
        <ModalBody pb={6}>
          <Text mb={5} color={"blackAlpha.600"}>
            Once the API key is created you will not be able to see it again, so if you lose it you will have to generate a new one.
          </Text>

          {/* alert */}
          {actionData?.days?.length! > 0 || actionData?.error?.length! > 0 ? (
            <Alert borderRadius={5} status='error' mb={5}>
              <AlertIcon />
              {actionData?.days || actionData?.error}
            </Alert>
          ) : null}

          {actionData?.apiKey?.length! > 0 ? (
            <HStack width={"full"}>
              <Text
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxW={"50%"}
              >
                {actionData?.apiKey!}
              </Text>
              <Button
                rightIcon={<RiFileCopyLine />}
                colorScheme="pink"
                variant="outline"
                size={"sm"}
                onClick={copyToClipboardHandler}
              >
                {buttonText}
              </Button>
            </HStack>
          ) : (
            <FormControl colorScheme="pink">
              <FormLabel>Expiration Days</FormLabel>
              <Input type={"number"} placeholder="Enter expiration days" value={days} onChange={(ev) => setDays(Number(ev.target.value))} />
            </FormControl>
          )}
        </ModalBody>

        {/* modal footer */}
        <ModalFooter>
          {actionData?.apiKey?.length! > 0 ? (
            <Button onClick={handleOnClose}>
              Close
            </Button>
          ) : (
            <>
              <Button
                colorScheme="pink"
                mr={3}
                isLoading={isFetching}
                onClick={handleOnClick}
                disabled={days < 0}
              >
                Create API Key
              </Button>
              <Button onClick={handleOnClose}>
                Cancel
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
