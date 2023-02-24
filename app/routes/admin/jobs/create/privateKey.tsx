import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link, useTransition } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  // check user is logged
  const userId = await requireUserId(request);

  const body = await request.formData();

  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }
  console.log("current");

  const privateKey = body.get("privateKey");
  current.privateKey = privateKey as string;

  await redis.set("createdJobFormData", current);

  return redirect("/admin/jobs/create/confirm");
};

export default function StepCron() {
  // Define state for loaders in the buttons
  const transition = useTransition();
  const isSubmitting =
    transition.submission?.formData.get("_action") === "next";
  const isGoingBack = transition.submission?.formData.get("_action") === "back";
  const isCanceling =
    transition.submission?.formData.get("_action") === "cancel";

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <Form method="post">
        <HStack justifyContent={"left"} w={"full"}>
          <VStack alignItems={"start"}>
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Private Key
            </Text>
            <Input
              name="privateKey"
              type="text"
              placeholder="Private key ..."
              width={"440px"}
            />
          </VStack>
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
            name="_action"
            value="next"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={isCanceling || isGoingBack}
          >
            CREATE
          </Button>
          <Button
            size={"sm"}
            colorScheme={"pink"}
            variant={"outline"}
            name="_action"
            value="back"
            type="submit"
            isLoading={isGoingBack}
            isDisabled={isCanceling || isSubmitting}
          >
            BACK
          </Button>
          <Button
            size={"sm"}
            colorScheme={"pink"}
            variant={"ghost"}
            type="submit"
            name="_action"
            value="cancel"
            isLoading={isCanceling}
            isDisabled={isGoingBack || isSubmitting}
          >
            Cancel
          </Button>
        </HStack>
      </Form>
      <HStack>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your Cronjob.
        </Text>
      </HStack>
    </HStack>
  );
}
