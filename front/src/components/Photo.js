import React from "react";
import {
  List,
  Datagrid,
  Create,
  Edit,
  SimpleForm,
  ImageField,
  ImageInput,
  ReferenceArrayInput,
  SelectArrayInput,
  TextInput,
  EditButton,
  TextField,
  ChipField,
  ArrayField,
  SingleFieldList,
  BooleanInput
} from "react-admin";

export const PhotoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="name" />
      <TextField source="isActive" />
      <ArrayField source="categories">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ImageField source="path" />
    </Datagrid>
  </List>
);

export const PhotoEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <Datagrid>
        <BooleanInput label="Publier" source="isActive" />
        <EditButton />
      </Datagrid>
    </SimpleForm>
  </Edit>
);

export const PhotoCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceArrayInput reference="category" source="name">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ImageInput
        source="pictures"
        label="Related pictures"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);
