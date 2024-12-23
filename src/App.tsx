import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  nanoDarkTheme,
  nanoLightTheme,
  radiantLightTheme,
  radiantDarkTheme,
  houseLightTheme,
  houseDarkTheme,
  useStore,
  localStorageStore,
  StoreContextProvider,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
// import { authProvider } from "./authProvider";
// import { UserList } from "./users";
// import { PostList, PostEdit, PostCreate } from "./posts";
// import { UserShow } from "./userDetail";
// import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./dashboard";
import { ThemeName, themes } from "./theme/themes";

const store = localStorageStore(undefined, "ECommerce");

export const App = () => {
  const [themeName] = useStore<ThemeName>("themeName", "soft");
  const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      layout={Layout}
      dataProvider={dataProvider}
      // authProvider={authProvider}
      disableTelemetry
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      dashboard={Dashboard}
      store={store}
    >
      {/* <Resource name="posts" list={ListGuesser} /> */}
      {/* <Resource name="users" list={UserList} show={UserShow} icon={UserIcon} /> */}
      <Resource
        name="user"
        list={ListGuesser}
        // list={PostList}
        // create={PostCreate}
        edit={EditGuesser}
        // edit={PostEdit}
        show={ShowGuesser}
        icon={UserIcon}
      />
    </Admin>
  );
};

const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <App />
  </StoreContextProvider>
);

export default AppWrapper;
