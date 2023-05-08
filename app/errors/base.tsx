export const BaseError = ({ error }: { error: Error }) => {
  console.error(error);
  return <>here in error section</>;
};
