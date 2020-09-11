import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { minutesToTimeGetMinutes, minutesToTimeGetHours } from '../../utils/time-utils';
import './create-recipe.scss';

export default function TimeDurationInput(props) {
    const [hours, setHours] = useState(minutesToTimeGetHours(props.minutes));
    const [minutes, setMinutes] = useState(minutesToTimeGetMinutes(props.minutes));
    const { onChange } = props;

    const validateInput = (string) => {
        const replacedString = string.replace(/\D/g, '');
        const choppedString = replacedString.substring(0, 2);
        return choppedString;
    };

    useEffect(() => {
        const localHours = hours ? parseInt(hours) : 0;
        const localMinutes = minutes ? parseInt(minutes) : 0;
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
