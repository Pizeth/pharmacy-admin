import {
  Admin,
  Resource,
  localStorageStore,
  StoreContextProvider,
} from "react-admin";
import { Layout } from "./Layout/Layout";
// import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
// import { authProvider } from "./authProvider";
import { UserList } from "./users";
// import { PostList, PostEdit, PostCreate } from "./posts";
// import { UserShow } from "./userDetail";
// import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./dashboard";
import { UserShow } from "./userDetail";
import { UserEdit } from "./userEdit";
import { UserCreate } from "./userCreate";
import { lightTheme, darkTheme } from "./theme/razeth";
import { i18nProvider } from "./i18n/i18nProvider";

const store = localStorageStore(undefined, "ECommerce");

// const theme = {
//   ...defaultTheme,
//   components: {
//     ...defaultTheme.components,
//     MuiTextField: {
//       defaultProps: {
//         variant: "outlined",
//       },
//     },
//     MuiFormControl: {
//       defaultProps: {
//         variant: "outlined",
//       },
//     },
//   },
// };

export const App = () => {
  // const [themeName] = useStore<ThemeName>("themename", "soft");
  // const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  // const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      i18nProvider={i18nProvider}
      layout={Layout}
      dataProvider={dataProvider}
      // authProvider={authProvider}
      disableTelemetry
      // theme={theme}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="dark"
      dashboard={Dashboard}
      store={store}
    >
      {/* <Resource name="posts" list={ListGuesser} /> */}
      {/* <Resource name="users" list={UserList} show={UserShow} icon={UserIcon} /> */}
      <Resource
        name="user"
        list={UserList}
        // list={PostList}
        // create={PostCreate}
        edit={UserEdit}
        // edit={PostEdit}
        show={UserShow}
        create={UserCreate}
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
