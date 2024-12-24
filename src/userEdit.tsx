import {
  BooleanInput,
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

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      {/* <TextInput source="id" readOnly /> */}
      <TextInput source="id" InputProps={{ disabled: true }} />
      <TextInput source="username" InputProps={{ disabled: true }} />
      <TextInput source="email" InputProps={{ disabled: true }} />
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
      {/* <NumberInput source="createdBy" /> */}
      {/* <DateInput source="createdDate" /> */}
      <NumberInput source="lastUpdatedBy" />
      {/* <DateInput source="lastUpdatedDate" /> */}
      {/* <ReferenceInput source="profile" reference="profile.id" /> */}
    </SimpleForm>
  </Edit>
);
