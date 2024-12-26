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
import UsernameInput from "./CustomFields/UsernameInput";
const choices = [
  { id: "SUPER_ADMIN", name: "Super Admin" },
  { id: "ADMIN", name: "Admin" },
  { id: "MANAGER", name: "Manager" },
  { id: "CASHIER", name: "Cashier" },
  { id: "USER", name: "User" },
];

// const UserCreate: React.FC = (props) => (
//   <Create {...props}>
//     <SimpleForm>
//       {" "}
//       <TextInput source="password" label="Password" type="password" />{" "}
//     </SimpleForm>{" "}
//   </Create>
// );

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      {/* <TextInput source="id" readOnly /> */}
      <UsernameInput source="username" label="Username" />
      {/* <TextInput source="username" /> */}
      <TextInput source="email" label="Email" />
      <TextInput source="password" label="Password" type="password" />
      <TextInput source="rePassword" label="Re Password" type="password" />
      {/* <TextInput source="password" />
      <TextInput source="rePassword" /> */}
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
