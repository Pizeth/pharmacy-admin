import {
  BooleanInput,
  Create,
  DateInput,
  Edit,
  ImageField,
  ImageInput,
  NumberInput,
  PasswordInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useResourceContext,
} from "react-admin";
import ValidationInput from "./CustomFields/LiveValidationInput";
import EmailInput from "./CustomFields/EmailInput";
import PasswordInputMeter from "./CustomFields/PasswordInputMeter";

const API_URL = import.meta.env.VITE_API_URL;
const choices = [
  { id: "SUPER_ADMIN", name: "Super Admin" },
  { id: "ADMIN", name: "Admin" },
  { id: "MANAGER", name: "Manager" },
  { id: "CASHIER", name: "Cashier" },
  { id: "USER", name: "User" },
];

// const validateUsername = async (value: string) => {
//   if (!value) return;
//   // console.log(`${API_URL}/user/username/${username}`);
//   try {
//     const response = await axios.get<any>(`${API_URL}/user/username/${value}`);
//     console.log(response);
//     const data = response.data; //as { exists: boolean; message?: string };
//     // console.log(data);
//     if (data) {
//       // setMsg(data.message || null);
//       return data.message;
//     }
//     return null;
//   } catch (error) {
//     console.error(error);
//     return "An error occurred while checking the username";
//   }
//   return undefined;
// };

// const validateEmailUnicity = async (value) => {
//   const isEmailUnique = await checkEmailIsUnique(value);
//   if (!isEmailUnique) {
//     return "Email already used";

//     // You can return a translation key as well
//     return "myroot.validation.email_already_used";

//     // Or even an object just like the other validators
//     return {
//       message: "myroot.validation.email_already_used",
//       args: { email: value },
//     };
//   }

//   return undefined;
// };
const equalToPassword = (value: string, allValues: { password: string }) => {
  if (value !== allValues.password) {
    return "The two passwords must match!";
  }
};

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      {/* <TextInput source="id" readOnly /> */}
      <ValidationInput
        source="username"
        label="Username"
        resettable
        variant="outlined"
      />
      {/* <TextInput source="username" validate={validateUsername} /> */}
      <ValidationInput source="email" label="Email" resettable type="email" />
      {/* <TextInput source="email" label="Email" /> */}
      <PasswordInputMeter source="password" label="Password" />
      <PasswordInput
        source="rePassword"
        label="Re Password"
        validate={equalToPassword}
      />
      {/* <TextInput source="password" label="Password" type="password" /> */}
      {/* <TextInput source="rePassword" label="Re Password" type="password" /> */}
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

// src/components/RentalCreate.js
// import React, { useState, useEffect } from 'react';
// import {
//   Create,
//   SimpleForm,
//   DateTimeInput,
//   SelectInput,
//   useNotify,
//   useRefresh,
//   useRedirect,
//   useQuery,
//   TextInput,
// } from 'react-admin';

// const RentalCreate = (props) => {
//   const notify = useNotify();
//   const refresh = useRefresh();
//   const redirect = useRedirect();

//   const onSuccess = ({ data }) => {
//     notify(`New User created `);
//     redirect(`/rentals?filter=%7B"id"%3A"${data.id}"%7D`);
//     refresh();
//   };

//   const [customers, setCustomers] = useState([]);
//   const { data: customer } = useQuery({
//     type: 'getList',
//     resource: 'customers',
//     payload: {
//       pagination: { page: 1, perPage: 600 },
//       sort: { field: 'email', order: 'ASC' },
//       filter: {},
//     },
//   });

//   const [films, setFilms] = useState([]);
//   const { data: film } = useQuery({
//     type: 'getList',
//     resource: 'films',
//     payload: {
//       pagination: { page: 1, perPage: 1000 },
//       sort: { field: 'title', order: 'ASC' },
//       filter: {},
//     },
//   });

//   useEffect(() => {
//     if (film) setFilms(film.map((d) => ({ id: d.title, name: d.title })));
//     if (customer)
//       setCustomers(customer.map((d) => ({ id: d.email, name: d.email })));
//   }, [film, customer]);

//   return (
//     <Create {...props} title='Create new Rental' onSuccess={onSuccess}>
//       <SimpleForm>
//         <TextInput disabled source='staff_id' defaultValue='1' />
//         <SelectInput source='customer_email' choices={customers} />
//         <SelectInput source='film_title' choices={films} />
//         <SelectInput
//           source='status'
//           defaultValue='borrowed'
//           disabled
//           choices={[
//             { id: 'borrowed', name: 'borrowed' },
//             { id: 'delayed', name: 'delayed' },
//             { id: 'lost', name: 'lost' },
//             { id: 'returned', name: 'returned' },
//           ]}
//         />

//         <DateTimeInput source='rental_date' />

//         <DateTimeInput source='return_date' />
//       </SimpleForm>
//     </Create>
//   );
// };

// export default RentalCreate;
