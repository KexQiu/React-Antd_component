import React, { FC, useState, useEffect, useRef } from 'react';
import { Select, Divider, Input, Checkbox, Row, Col } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SelectProps {
    colNumber: number  //多选框列数
    dataMap: any[]  //需要渲染的数组
    optionVal: string  //下拉框选项的value
    optionShow: string  //下拉框选项的展示内容
    maxTagCount?: number  //多选框中最多存放标签数,默认三个
    checked?: any[]  //默认选中的数组，只能存放选中的value
}

export const MultiSelect: FC<SelectProps> = (props) => {
    const { dataMap, colNumber, optionVal, optionShow, maxTagCount } = props
    const [isAll,setIsAll] = useState<boolean>(false)  //是否全选
    const [checked,setChecked] = useState<any[]>([])  //被选中的value数组
    const [showList,setShowList] = useState<boolean[]>([])  //搜索后展示的内容
    const [allKey,setAllKey] = useState<any[]>([])  //所有选项的value集合
    const [indeterminate, setIndeterminate] = React.useState(false);  //全选按钮的状态

    useEffect(() => {
        dataMap.map(e => {
            allKey.push(e[optionVal])
        })
        let showArr = []
        for(let i;i < dataMap.length;i++){
            showArr[i] = false
        }
        setShowList(showArr)
        setAllKey(allKey)
        if(props.checked){
            setChecked(props.checked)
            setIndeterminate(true)
            setIsAll(props.checked.length == dataMap.length)
        }
        return () => {}
    }, [dataMap])

    const onChange = list => {
        setChecked(list);
        setIndeterminate(!!list.length && list.length < allKey.length);
        setIsAll(list.length === allKey.length);
    };

    const onCheckAllChange = e => {
        setChecked(e.target.checked ? allKey : []);
        setIndeterminate(false);
        setIsAll(e.target.checked);
    };

    const search = val => {
        let showArr = []
        dataMap.map((e,index) => {
            if(e[optionShow].indexOf(val) != -1){
                showArr[index] = false
            }else{
                showArr[index] = true
            }
        })
        setShowList(showArr)
    }

    return (
        <Select 
            maxTagTextLength={3} 
            dropdownStyle={{maxHeight: 300}} 
            maxTagCount={maxTagCount ? maxTagCount : 3} 
            value={checked} onClear={() => {return setChecked([])}} 
            allowClear mode='multiple' 
            style={{width:'100%'}} 
            dropdownRender={menu => (
                <Row style={{height:'100%'}}>
                    <Col span={6} style={{padding:10,borderRight: "1px #f0f0f0 solid"}}>
                        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={isAll}>{'全选'}</Checkbox>
                    </Col>
                    <Col span={18} style={{height:'100%'}}>
                        <div style={{padding:10,height:50,borderBottom: "1px #f0f0f0 solid"}}>
                            <Input
                                placeholder="搜索"
                                prefix={<SearchOutlined className="site-form-item-icon" />}
                                onChange={e => search(e.target.value)}
                            />
                        </div>
                        <Checkbox.Group onChange={onChange} value={checked} style={{padding:5,maxHeight:250,width:'100%',overflow:'auto'}}>
                            <Row style={{padding:5,height:'100',width:'100%',overflow:'auto'}}>
                                {
                                    dataMap ? 
                                        dataMap.length > 0 ? 
                                            dataMap.map((e,index) =>  {
                                                return ( <Col key={e[optionVal]} span={24/colNumber} hidden={showList[index]} >
                                                    <Checkbox value={e[optionVal]}>{e[optionShow]}</Checkbox>
                                                </Col> )
                                            }) : <></> : <></>
                                }
                            </Row>
                        </Checkbox.Group>
                    </Col>
                </Row>
            )}
        >
            {
                dataMap ? 
                    dataMap.length > 0 ? 
                        dataMap.map(e =>  {
                            return <Option key={e[optionVal]} value={e[optionVal]}>{e[optionShow]}</Option>
                        }) : <></> : <></>
            }
        </Select>
    );
}
