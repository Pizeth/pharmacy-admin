import {
  Create,
  email,
  ImageField,
  ImageInput,
  NumberInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
  ToolbarProps,
  useNotify,
  useRecordContext,
  useTranslate,
  useUnique,
  // required,
  maxValue,
  PasswordInput,
} from "react-admin";
import { useFormState, useFormContext } from "react-hook-form";
import { InputAdornment } from "@mui/material";
import ValidationInput from "./CustomFields/LiveValidationInput";
import {
  PermIdentity,
  MailOutline,
  Password,
  PeopleAltRounded,
  SwitchAccount,
} from "@mui/icons-material";
import { useState } from "react";
import PasswordValidationInput from "./fortest";
import IconInput from "./CustomFields/IconInput";
import {
  asyncValidator,
  matchPassword,
  serverValidator,
  useRequired,
} from "./Utils/validator";
import { ValidationInput1 } from "./Utils/test2";
import { ResettableTextField } from "./Utils/reset";
import { TextInput } from "./Utils/text";
// import { required } from "./Utils/validator";

const choices = [
  { id: "SUPER_ADMIN", name: "Super Admin", disabled: true },
  { id: "ADMIN", name: "Admin" },
  { id: "MANAGER", name: "Manager" },
  { id: "CASHIER", name: "Cashier" },
  { id: "USER", name: "User" },
];

// const CustomToolbar = (props: ToolbarProps) => {
//   const { errors, isValid, isDirty } = useFormState();
//   console.log(errors);
//   console.log(isValid);
//   console.log(isDirty);
//   console.log(useFormState());
//   const hasErrors = Object.keys(errors).length > 0;

//   return (
//     <Toolbar {...props}>
//       <SaveButton disabled={hasErrors || !isValid || !isDirty} />
//     </Toolbar>
//   );
// };

const CustomToolbar = (props: ToolbarProps) => {
  // const {
  //   formState: { errors, isValid, isDirty },
  // } = useFormContext();
  const { errors, isValid, isDirty } = useFormState();
  // console.log(errors);
  // const hasErrors = Object.keys(errors).length > 0;
  const hasErrors = Object.values(errors).some((error) => !!error);
  // console.log(hasErrors);

  return (
    <Toolbar {...props}>
      <SaveButton disabled={hasErrors || !isValid || !isDirty} />
    </Toolbar>
  );
};

export const UserCreate = () => {
  type FocusedField = "rePassword" | "role" | null;
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState("");
  // const [focused, setFocused] = useState(false);
  const [focused, setFocused] = useState<FocusedField>(null);

  // const handleFocus = () => setFocused(true);
  const handleFocus = (field: FocusedField) => setFocused(field);
  // const handleBlur = () => setFocused(false);
  const handleBlur = () => setFocused(null);
  const unique = useUnique();
  const require = useRequired();

  return (
    <Create>
      <SimpleForm
        toolbar={<CustomToolbar />}
        mode="all"
        reValidateMode="onBlur"
        sanitizeEmptyValues
      >
        {/* <ValidationInput1
          source="username"
          resettable
          className="icon-input"
          iconStart={<PermIdentity />}
        /> */}
        {/* <ValidationInput
          source="email"
          resettable
          className="icon-input"
          iconStart={<MailOutline />}
          type="email"
        /> */}
        {/* <PasswordInputMeter
          source="password"
          iconStart={<Password />}
          className="icon-input"
          // onChangeCapture={(e) =>
          //   setPassword((e.target as HTMLInputElement).value)
          // }
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          // onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        {/* <PasswordValidationInput
          source="password"
          iconStart={<Password />}
          className="icon-input"
          strengthMeter
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        <PasswordValidationInput
          source="rePassword"
          passwordValue={password}
          iconStart={<Password />}
          className="icon-input"
        /> */}
        <TextInput source={"email"} resettable></TextInput>
        <ResettableTextField resettable />
        <IconInput
          source="authMethod"
          className="icon-input"
          iconStart={<SwitchAccount />}
          validate={require()}
          resettable
        />
        <SelectInput
          source="role"
          choices={choices}
          emptyText="No role selected"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PeopleAltRounded />
              </InputAdornment>
            ),
          }}
          className="icon-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          // onFocus={handleFocus}
          onFocus={() => handleFocus("role")}
          onBlur={handleBlur}
          required
          InputLabelProps={{
            shrink: role !== "" || focused === "role",
          }}
        />
        <ImageInput
          source="file"
          label="Avatar"
          accept={{ "image/*": [".png", ".jpg"] }}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <NumberInput source="createdBy" />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;

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
