import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";

export const action = async ({ request }: ActionArgs) => {
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
  // TODO(nb): put the cronjob as item list
  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <Form method="post">
        <HStack justifyContent={"left"} w={"full"}>
          <VStack alignItems={"start"}>
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Account
            </Text>
            <Input
              name="privateKey"
              type="text"
              placeholder="Private key"
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
            name={"_action"}
            value={"submit"}
            type="submit"
          >
            NEXT
          </Button>
          <Link to="/admin/jobs/methods">
            <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
              BACK
            </Button>
          </Link>
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
      <HStack>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your private key.
        </Text>
      </HStack>
    </HStack>
  );
}
