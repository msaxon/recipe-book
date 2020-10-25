import React, {useState} from 'react';
import { Dropdown } from 'semantic-ui-react';
import { uniq } from 'underscore';
import { TAGS } from '../../../models/tags';
import '../../create/create-recipe.scss';

export default function MultiTextInput(props) {
    const [addedTags, setAddedTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(props.tags ? props.tags : []);
    const { onChange } = props;

    const options = uniq(TAGS.concat(addedTags).concat(selectedTags)).map((tag) => {
        return {
            key: tag,
            text: tag,
            value: tag,
        };
    });

    const addItemToState = (event, newTag) => {
        setAddedTags([...addedTags, newTag.value]);
    }

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
                additionLabel="New Label: "
                allowAdditions={true}
                onAddItem={addItemToState}
                options={options}
                onChange={(e, d) => {
                    console.log('d.value', d.value);
                    onChange(d.value);
                    setSelectedTags(d.value);
                }}
                value={selectedTags}
            />
        </div>
    );
}
