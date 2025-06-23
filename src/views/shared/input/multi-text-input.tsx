import React, { type Dispatch, type SetStateAction, useState } from 'react';

import { TagsInput } from '@mantine/core';
import { uniq } from 'underscore';

import { TAGS } from '../../../models/tags';

import '../../create/create-recipe.scss';

interface IProps {
  tags: string[];
  name: string;
  onChange: Dispatch<SetStateAction<any>>;
  ref: React.Ref<any>;
}

export default function MultiTextInput(props: IProps) {
  // const [addedTags, setAddedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    props.tags ? props.tags : []
  );
  // const { onChange } = props;
  // TODO onchange

  const options: string[] = uniq(TAGS.concat(selectedTags));

  return (
    <div>
      <TagsInput
        name={props.name}
        data={options}
        value={selectedTags}
        onChange={setSelectedTags}
      />
    </div>
  );
}
