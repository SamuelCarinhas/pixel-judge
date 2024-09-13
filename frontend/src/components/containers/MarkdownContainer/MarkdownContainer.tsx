import IMarkdownContainer from "./IMarkdownContainer"
import ReactMarkdown from 'react-markdown';
import './MarkdownContainer.css'
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.css';
import rehypeRaw from "rehype-raw";

export default function MarkdownContainer(props: IMarkdownContainer) {

    return (
        <div className='markdown-container'>
            <ReactMarkdown
                children={props.content}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
            />
        </div>
    )
}