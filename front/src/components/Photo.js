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
  ArrayField,
  ImageField
} from "react-admin";

export const PhotoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="categories.name" />
      <ImageField source="path" />
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
