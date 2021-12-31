import React, {Dispatch, SetStateAction, SyntheticEvent, useState} from 'react';
import {Dropdown, DropdownProps} from 'semantic-ui-react';
import { uniq } from 'underscore';
import { TAGS } from '../../../models/tags';
import '../../create/create-recipe.scss';

interface IProps {
    tags: string[];
    name: string;
    onChange: Dispatch<SetStateAction<any>>;
    ref: React.Ref<any>
}

interface Tag {
    key: string;
    text: string;
    value: string;
}

export default function MultiTextInput(props: IProps) {
    const [addedTags, setAddedTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<any>(props.tags ? props.tags : []);
    const { onChange } = props;

    const options: Tag[] = uniq(TAGS.concat(addedTags).concat(selectedTags)).map((tag: string) => {
        return {
            key: tag,
            text: tag,
            value: tag,
        };
    });

    const addItemToState = (event: any, newTag: DropdownProps) => {
        setAddedTags([...addedTags, newTag.value as string]);
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
                onChange={(e:SyntheticEvent<HTMLElement>, d: DropdownProps) => {
                    onChange(d.value);
                    setSelectedTags(d.value);
                }}
                value={selectedTags}
            />
        </div>
    );
}
