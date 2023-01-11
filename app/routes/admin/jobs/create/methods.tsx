import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/admin/jobs/create/cronjob");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }
  console.log("current: ", current);

  // get provider and network values from form and save in redis
  const checkMethod = body.get("checkMethod");
  const actionMethod = body.get("actionMethod");

  console.log("checkMethod: ", checkMethod);
  console.log("actionMethod: ", actionMethod);

  current.checkMethod = checkMethod as string;
  current.actionMethod = actionMethod as string;
  await redis.set("createdJobFormData", current);

  console.log("setted");
  // redirect to confirm page
  return redirect(`/admin/jobs/create/privateKey`);
};

export default function StepAddress() {
  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Check method
            </Text>
            <Input
              name="checkMethod"
              type="text"
              placeholder="0x..."
              width={"440px"}
            />
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Action method
            </Text>
            <Input
              name="actionMethod"
              type="text"
              placeholder="0x..."
              width={"440px"}
            />
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
              <Link to="/admin/jobs/cronjob">
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
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your check method. Put your action method.
        </Text>
      </HStack>
    </HStack>
  );
}
