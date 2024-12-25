import {
  BooleanInput,
  Create,
  DateInput,
  Edit,
  ImageField,
  ImageInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
const choices = [
  { id: "SUPER_ADMIN", name: "Super Admin" },
  { id: "ADMIN", name: "Admin" },
  { id: "MANAGER", name: "Manager" },
  { id: "CASHIER", name: "Cashier" },
  { id: "USER", name: "User" },
];

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      {/* <TextInput source="id" readOnly /> */}
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="password" />
      <TextInput source="rePassword" />
      {/* <TextInput source="avatar" /> */}
      <ImageInput
        source="file"
        label="Avatar"
        accept={{ "image/*": [".png", ".jpg"] }}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <SelectInput source="role" choices={choices} />
      {/* <TextInput source="authMethod" /> */}
      {/* <TextInput source="mfaSecret" /> */}
      {/* <BooleanInput source="mfaEnabled" /> */}
      {/* <DateInput source="loginAttempts" /> */}
      {/* <DateInput source="lastLogin" /> */}
      {/* <BooleanInput source="isBan" /> */}
      {/* <BooleanInput source="enabledFlag" /> */}
      {/* <BooleanInput source="isLocked" /> */}
      {/* <TextInput source="deletedAt" /> */}
      <NumberInput source="createdBy" />
      {/* <DateInput source="createdDate" /> */}
      {/* <NumberInput source="lastUpdatedBy" /> */}
      {/* <DateInput source="lastUpdatedDate" /> */}
      {/* <ReferenceInput source="profile" reference="profile.id" /> */}
    </SimpleForm>
  </Create>
);
