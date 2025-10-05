import React, { type Dispatch, type SetStateAction } from 'react';

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
  const options: string[] = uniq(TAGS.concat(props.tags ?? []));

  return (
    <div>
      <TagsInput
        name={props.name}
        data={options}
        value={props.tags}
        onChange={props.onChange}
      />
    </div>
  );
}
