import { useEffect, useState } from 'react';

import { TextInput } from '@mantine/core';

import {
  minutesToTimeGetHours,
  minutesToTimeGetMinutes,
} from '../../utils/time-utils';

import './create-recipe.scss';

interface IProps {
  minutes: number;
  name: string;
  onChange: (n: any) => void;
}

export default function TimeDurationInput(props: IProps) {
  const [hours, setHours] = useState<number>(
    minutesToTimeGetHours(props.minutes)
  );
  const [minutes, setMinutes] = useState<number>(
    minutesToTimeGetMinutes(props.minutes)
  );
  const { onChange } = props;

  const validateInput = (string: string): number => {
    const replacedString = string.replace(/\D/g, '');
    return parseInt(replacedString);
  };

  useEffect(() => {
    const localHours = hours ? hours : 0;
    const localMinutes = minutes ? minutes : 0;
    onChange(localHours * 60 + localMinutes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, minutes]);

  return (
    <div className="time-duration-input">
      <TextInput
        name={props.name + '-h'}
        label="hours"
        value={hours}
        onChange={(e) => setHours(validateInput(e.target.value))}
      />
      <TextInput
        name={props.name + '-m'}
        label="minutes"
        value={minutes}
        onChange={(e) => setMinutes(validateInput(e.target.value))}
      />
    </div>
  );
}
