import { Badge } from "@chakra-ui/react";

export const StatusIcon = ({
  status,
  color,
}: {
  status: string;
  color: string;
}) => {
  return (
    <Badge textTransform={"uppercase"} colorScheme={color}>
      {status}
    </Badge>
  );
};
