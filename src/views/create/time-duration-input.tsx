import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { minutesToTimeGetMinutes, minutesToTimeGetHours } from '../../utils/time-utils';
import './create-recipe.scss';

interface IProps {
    minutes: number;
    name: string;
    onChange: (n: any) => void;
}

export default function TimeDurationInput(props: IProps) {
    const [hours, setHours] = useState<number>(minutesToTimeGetHours(props.minutes));
    const [minutes, setMinutes] = useState<number>(minutesToTimeGetMinutes(props.minutes));
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
            <Input
                name={props.name + '-h'}
                label="hours"
                labelPosition="right"
                value={hours}
                onChange={(e) => setHours(validateInput(e.target.value))}
            />
            <Input
                name={props.name + '-m'}
                label="minutes"
                labelPosition="right"
                value={minutes}
                onChange={(e) => setMinutes(validateInput(e.target.value))}
            />
        </div>
    );
}
