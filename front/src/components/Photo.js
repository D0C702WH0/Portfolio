import React from "react";
import {
  List,
  Datagrid,
  Create,
  SimpleForm,
  TextInput,
  DateField,
  TextField,
  EditButton,
  ArrayField
} from "react-admin";

export const PhotoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
    </Datagrid>
  </List>
);

export const PhotoCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
    </SimpleForm>
  </Create>
);
