import React from 'react';

import { TagsInput } from '@mantine/core';
import { uniq } from 'underscore';

import { TAGS } from '../../../models/tags';

import '../../create/create-recipe.scss';

interface IProps {
  value?: string[];
  name?: string;
  onChange: (value: string[]) => void;
  ref?: React.Ref<any>;
}

export default function MultiTextInput(props: IProps) {
  const options: string[] = uniq(TAGS.concat(props.value ?? []));

  return (
    <div>
      <TagsInput
        name={props.name}
        data={options}
        value={props.value || []}
        onChange={props.onChange}
      />
    </div>
  );
}
