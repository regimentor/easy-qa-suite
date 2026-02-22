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
const $userIsAuthenticeted = userDomain.createStore<boolean>(false);
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

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Login failed");
    }

    return { data: response.data.userData };
  },
});

$user.on(logInFx.doneData, (_, { data }) => {
  return data;
});

const getCurrentUserFx = userDomain.createEffect<void, TUser, Error>({
  name: "getCurrentUser",
  handler: async () => {
    const response = await api.get<TUser>("/me");
    if (response.status !== 200) {
      throw new Error("Failed to get current user");
    }
    return response.data;
  },
});

$user.on(getCurrentUserFx.doneData, (_, user) => user);
$user.on(getCurrentUserFx.fail, () => null);
$userIsAuthenticeted.on(getCurrentUserFx.doneData, () => true);
$userIsAuthenticeted.on(getCurrentUserFx.fail, () => false);

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

$userIsAuthenticeted.on(isAuthenticatedFx.doneData, (_, result) => result);
$userIsAuthenticeted.on(logInFx.doneData, () => true);

const logOutFx = userDomain.createEffect({
  name: "logOut",
  handler: async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
});

$user.on(logOutFx.done, () => null);
$userIsAuthenticeted.on(logOutFx.done, () => false);

export {
  userDomain,
  $user,
  logInFx,
  logOutFx,
  getCurrentUserFx,
  isAuthenticatedFx,
  $userIsAuthenticeted,
};
