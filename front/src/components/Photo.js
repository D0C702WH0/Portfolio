import React from "react";
import {
  List,
  Datagrid,
  Create,
  SimpleForm,
  TextInput,
  TextField,
  ImageField,
  ChipField,
  ArrayField,
  SingleFieldList
} from "react-admin";

export const PhotoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="name" />
      <ArrayField source="categories">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
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
