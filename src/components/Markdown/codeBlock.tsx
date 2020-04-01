import React from 'react'
import { Prism as SyntaxHighLighter } from 'react-syntax-highlighter'
import { atomDark as styles } from 'react-syntax-highlighter/dist/esm/styles/prism'

export interface CodeBlockProps {
    value: string,
    language: string | string[]
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    value,
    language
}) => {
    return (<SyntaxHighLighter 
        language={language} 
        style={styles}>
        {value}
    </SyntaxHighLighter>)
}

CodeBlock.defaultProps = {
    language: ['text', 'javascript', 'bash', 'css', 'dart', 'docker', 'git', 'jsx', 'typescript', 'tsx', 'nginx', 'less', 'scss']
}

export default CodeBlock