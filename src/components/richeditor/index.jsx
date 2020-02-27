import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import propTypes from 'prop-types'
import styles from './index.less'

function RichEditor ({value, onChange}) {
    return (<div className={styles.richtext}>
        <ReactQuill
            className={styles.richtext__body}
            value = {value}
            onChange={onChange} />
    </div>)
}

RichEditor.propTypes = {
    value: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired
}

RichEditor.defaultProps = {
    value: '',
    onChange: () => {}
}

export default RichEditor