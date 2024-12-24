import {
  BooleanField,
  DateField,
  EmailField,
  ImageField,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <ImageField source="avatar" title="avatar" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="role" />
      {/* <TextField source="authMethod" />
      <BooleanField source="mfaEnabled" />
      <DateField source="loginAttempts" />
      <TextField source="lastLogin" />
      <BooleanField source="isBan" />
      <BooleanField source="enabledFlag" />
      <BooleanField source="isLocked" />
      <TextField source="deletedAt" />
      <NumberField source="createdBy" />
      <DateField source="creationDate" />
      <NumberField source="lastUpdatedBy" />
      <DateField source="lastUpdateDate" /> 
      <NumberField source="objectVersionId" />*/}
      {/* <ReferenceField source="objectVersionId" reference="objectVersions" /> */}
      {/* <ReferenceField source="profile" reference="profile"/> */}
    </SimpleShowLayout>
  </Show>
);
