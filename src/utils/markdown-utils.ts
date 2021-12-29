import Showdown from 'showdown';


export const convertMarkdownToHtml = (markdown: string) => {
    const converter = new Showdown.Converter();
    converter.setOption('simpleLineBreaks', true);
    return converter.makeHtml(markdown);
};
