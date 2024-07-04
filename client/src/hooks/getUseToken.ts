import { useCookies } from "react-cookie";

export const token = () => {
  const [cookies, _] = useCookies["access_token"];

  return { header: { authorization: cookies.access_token } };
};
