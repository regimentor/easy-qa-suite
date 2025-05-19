import { api } from "@/lib/api";
import { createDomain } from "effector";

type TUserStoreLogInFxInput = {
  username: string;
  password: string;
};

type TUser = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type TUserStoreLogInFxRes = {
  accessToken: string;
  refreshToken: string;
  userData: TUser;
};

type TUserStoreLogInFxDone = {
  data: TUser;
};

const userDomain = createDomain({ name: "user" });
const $user = userDomain.createStore<TUser | null>(null);
const logInFx = userDomain.createEffect<
  TUserStoreLogInFxInput,
  TUserStoreLogInFxDone,
  Error
>({
  name: "logIn",
  handler: async (userData) => {
    const response = await api.post<TUserStoreLogInFxRes>("/login", {
      ...userData,
    });

    if (response.status !== 201) {
      throw new Error("Login failed");
    }

    return { data: response.data.userData };
  },
});

$user.on(logInFx.doneData, (_, { data }) => {
  return data;
});

const isAuthenticatedFx = userDomain.createEffect({
  name: "isAuthenticated",
  handler: async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return false;
    }

    return true;
  },
});

const $userIsAuthenticeted = userDomain.createStore<boolean>(false);
$userIsAuthenticeted.on(isAuthenticatedFx.doneData, (_, result) => result);
$userIsAuthenticeted.on(logInFx.doneData, () => true);

export { userDomain, $user, logInFx, isAuthenticatedFx, $userIsAuthenticeted };
