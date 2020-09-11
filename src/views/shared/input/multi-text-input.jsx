import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { TAGS } from '../../../models/tags';
import '../../create/create-recipe.scss';

export default function MultiTextInput(props) {
    const { onChange } = props;
    console.log('onChange', onChange);

    const options = TAGS.map((tag) => {
        return {
            key: tag,
            text: tag,
            value: tag,
        };
    });

    return (
        <div>
            <Dropdown
                name={props.name}
                ref={props.ref}
                placeholder="Tags"
                fluid
                multiple
                selection
                search
                options={options}
                onChange={(e, d) => onChange(d.value)}
            />
        </div>
    );
}
