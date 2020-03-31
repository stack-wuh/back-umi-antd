import React, { Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'
import styles from './editor.less'

export interface MarkdownTmProps {
    source: string,
    className: string
}

const MarkdownTm: React.FC<MarkdownTmProps> = ({
    source,
    className
}) => {
    return (<Fragment>
        <ReactMarkdown
            className={classnames(styles.template, className)}
            source={source} />
    </Fragment>)
}

MarkdownTm.defaultProps = {
    source: '## hello world'
}

export default MarkdownTm