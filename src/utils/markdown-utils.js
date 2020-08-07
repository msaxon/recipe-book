import Showdown from 'showdown';

export const convertMarkdownToHtml = (markdown) => {
    const converter = new Showdown.Converter();
    converter.setOption('simpleLineBreaks', true);
    return converter.makeHtml(markdown);
};
