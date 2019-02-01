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
  SimpleShowLayout,
  Show,
  RichTextField,
  DateField,
  EditButton,
  TextField,
  ChipField,
  ArrayField,
  LongTextInput,
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
      <EditButton />
    </Datagrid>
  </List>
);

export const PhotoEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <BooleanInput label="Publier" source="isActive" />
    </SimpleForm>
  </Edit>
);

export const PhotoShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="name" />
      <RichTextField source="description" />
      <DateField label="Publication date" source="created_at" />
    </SimpleShowLayout>
  </Show>
);
export const PhotoCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceArrayInput reference="category" source="id">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ImageInput
        multiple={true}
        source="photo"
        label="photo"
        accept="image/*"
        placeholder={<p>Drop your file here</p>}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
      <LongTextInput source="name" placeholder={<p>Titre de la photo</p>} />
      <LongTextInput source="description" />
      <BooleanInput label="Publier" source="isActive" />
    </SimpleForm>
  </Create>
);
