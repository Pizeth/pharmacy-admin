import { useMediaQuery, Theme } from "@mui/material";
import {
  BooleanField,
  Datagrid,
  DateField,
  EditButton,
  EmailField,
  ImageField,
  List,
  NumberField,
  ReferenceField,
  SimpleList,
  TextField,
} from "react-admin";

export const UserList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.username}
          tertiaryText={(record) => record.email}
          leftAvatar={(record) => (
            <ImageField record={record} source="avatar" />
          )}
        />
      ) : (
        <Datagrid rowClick={false}>
          {/* <TextField source="id" /> */}
          <TextField source="username" />
          <EmailField source="email" />
          {/* <TextField source="password" /> */}
          {/* <TextField source="avatar" /> */}
          <ImageField source="avatar" title="avatar" />
          <TextField source="role" />
          <TextField source="authMethod" />
          {/* <TextField source="mfaSecret" /> */}
          <BooleanField source="mfaEnabled" />
          <NumberField source="loginAttempts" />
          <DateField source="lastLogin" />
          <BooleanField source="isBan" />
          {/* <BooleanField source="enabledFlag" /> */}
          <BooleanField source="isLocked" />
          {/* <TextField source="deletedAt" /> */}
          <NumberField source="createdBy" />
          <DateField source="createdDate" />
          <NumberField source="lastUpdatedBy" />
          <DateField source="lastUpdateDate" />
          {/* <NumberField source="objectVersionId" /> */}
          <NumberField source="profile.id" />
          <EditButton />
        </Datagrid>
      )}
    </List>
  );
};
