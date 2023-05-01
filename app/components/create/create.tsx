import { Flex, VStack } from "@chakra-ui/react";
import { Header } from "./header";
import { Form, useNavigation, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Footer } from "./footer";

export function Create<T>({
  title,
  steps,
  currentStep,
  baseTo,
  backTo,
  nextTo,
  form,
  children,
}: {
  title: string;
  steps: T[];
  baseTo: string;
  backTo?: string;
  nextTo?: string;
  currentStep: T;
  form: string;
  children: JSX.Element[];
}): JSX.Element {
  // validations
  if (!steps.includes(currentStep)) {
    throw new Error("invalid currentStep in create component");
  }
  if (children.length !== 2) {
    throw new Error("invalid children in create component");
  }

  // define hooks
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(false);

  // define effects
  useEffect(() => {
    if (navigation.formAction === pathname) {
      const newIsFetching = navigation.state === "submitting";
      if (isFetching != newIsFetching) {
        setIsFetching(newIsFetching);
      }
    }
  }, [navigation, pathname, isFetching]);

  // define values
  const index = steps.indexOf(currentStep);
  const buttonText = index === steps.length - 1 ? "create" : "next";

  return (
    <VStack
      width={"full"}
      maxW={"1000px"}
      alignItems={"start"}
      bg={"white"}
      borderStyle={"solid"}
      borderWidth={1}
      borderColor={"blackAlpha.300"}
      borderRadius={8}
      py={[6, 6, 7, 8, 10]}
      px={[6, 6, 7, 8, 12]}
    >
      <Form method="post" id={form}>
        <Header<T> title={title} steps={steps} currentIndex={index} />
        <Flex flexDirection={["column", "column", "row"]} width={"full"}>
          {children}
        </Flex>
        <input type="hidden" name={"baseTo"} value={baseTo} form={form} />
        <input type="hidden" name={"nextTo"} value={nextTo} form={form} />
        <Footer buttonText={buttonText} isFetching={isFetching} baseTo={baseTo} backTo={backTo} />
      </Form>
    </VStack>
  );
}
