import React from 'react'
import { Button } from 'antd'
import classnames from 'classnames'

export interface TableOptionBtnProps {
    className?: string,
    onClick?: (props?: object, btnObj?: object) => void,
    list: BtnOptionProps[],
    payload?: object,
    children?: React.ReactNode
}

export interface BtnOptionProps {
    text: string,
    onClick: (props?: object, btnObj?: object) => void,
}


const TableOptionBtns: React.FC<TableOptionBtnProps> = ({
    className,
    list,
    payload,
    children
}) => {
    return (<React.Fragment>
        <div className={classnames(className)}>
            {
                list.map(btn => (<Button
                        type='link'
                        key={btn.text}
                        onClick={(): void => btn && btn.onClick(payload, btn)}>
                        {btn.text}
                    </Button>))
            }
            {
                children
            }
        </div>
    </React.Fragment>)
}

TableOptionBtns.defaultProps = {
    list: [],
    className: '',
    payload: {},
    children: null
}

export default TableOptionBtns