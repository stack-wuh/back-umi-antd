import React from 'react'
import PropTypes from 'prop-types'
import { Input, Tabs } from 'antd'
import styles from './index.less'
import ReactMarkdown from 'react-markdown'

const TextArea = Input.TextArea
const TabPane = Tabs.TabPane

function Markdown ({ value, onChange, rows }) {
    return (<div className={styles.markdown}>
        <Tabs style={{height: '100%'}} type='card'>
            <TabPane tab='Write' key='w'>
                <TextArea
                    rows={rows}
                    className={styles.markdown__write}
                    value={value}
                    onChange={onChange} />
            </TabPane>
            <TabPane tab='Preview' key='p'>
                <ReactMarkdown source={value} />
            </TabPane>
        </Tabs>
    </div>)
}

Markdown.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    rows: PropTypes.number.isRequired
}

Markdown.defaultProps = {
    value: '',
    onChange: () => {},
    rows: 10
}

export default Markdown