import React from "react";
import {
  List,
  Datagrid,
  Edit,
  SimpleForm,
  EditButton,
  TextField,
  BooleanInput
} from "react-admin";

export const CategoryList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="isActive" />
      <TextField source="description" />

      <EditButton />
    </Datagrid>
  </List>
);

export const CategoryEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <BooleanInput label="Publier" source="isActive" />
    </SimpleForm>
  </Edit>
);
