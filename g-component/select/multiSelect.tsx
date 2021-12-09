import React, { FC, useState, useEffect, useRef } from 'react';
import { Select, Menu, Input, Checkbox, Row, Col, Empty, message  } from "antd";

const { Option } = Select;

interface SelectProps {
    colNumber: number  //多选框列数
    dataMap: any[]  //需要渲染的数组
    optionVal: string  //下拉框选项的value
    optionShow: string  //下拉框选项的展示内容
    maxTagCount?: number  //多选框中最多存放标签数,默认三个
    checked?: any[]  //默认选中的数组，只能存放选中的value
    onSelectChange?: (value) => void //选择器onchange事件
}

export const MultiSelect: FC<SelectProps> = (props) => {
    const { dataMap, colNumber, optionVal, optionShow, maxTagCount, onSelectChange } = props
    const [isAll,setIsAll] = useState<boolean>(false)  //是否全选
    const [checked,setChecked] = useState<any[]>([])  //被选中的value数组
    const [showList,setShowList] = useState<any[]>([])  //搜索后展示的内容
    const [showListIsShow,setShowListIsShow] = useState<boolean[]>([])  //搜索后展示的内容
    const [allKey,setAllKey] = useState<any[]>([])  //所有选项的value集合
    const [indeterminate, setIndeterminate] = useState<boolean>(false);  //全选按钮的状态
    const [menuChoose, setMenuChoose] = useState<number>(0)

    useEffect(() => {
        dataMap.map(e => {
            allKey.push(e[optionVal])
        })
        let arr = new Array(Math.ceil(dataMap.length/100)).fill(false)
        // setIndeterminates([...arr])
        // setIsAlls([...arr])
        setChecked(props.checked)
        setShowList(dataMap.slice(0,100))
        setShowListIsShow(new Array(dataMap.length).fill(false))
        setAllKey(allKey)
        if(props.checked){
            setChecked(props.checked)
            setIndeterminate(true)
            setIsAll(props.checked.length == dataMap.length)
        }
        return () => {}
    }, [dataMap])

    useEffect(() => {
        onSelectChange(checked)
    },[checked])

    const onChange = list => {
        setChecked(list);
        checkAll(list.length)
    };

    const onCheckAllChange = e => {
        setChecked(e.target.checked ? allKey : []);
        setIndeterminate(false);
        setIsAll(e.target.checked);
    };
    const onCheckRangeChange = (e,flag) => {
        if(!/[0-9]\~[0-9]/.test(e)) return message.error('填写格式错误')
        let range = e.split('~').map(e => Number(e))
        if(range[0] > range[1]) return message.error('开始数字大于结束数字')
        if(range.some(e => e < 1 || e > dataMap.length)) return message.error('填写数字有误')
        let checkedSet = new Set(checked)
        
        if(flag){
            for(let i = range[0];i <= range[1]; i++){
                checkedSet.add(i)
            }
        }else{
            for(let i = range[0];i <= range[1]; i++){
                checkedSet.delete(i)
            }
        }
        const checkedList = Array.from(checkedSet)
        setChecked(checkedList);
        checkAll(checkedList.length)
    };

    const checkAll:(length:number) => void = length => {
        setIndeterminate(!!length && length < allKey.length);
        setIsAll(length === allKey.length);
    }

    const search = val => {
        let showArr = []
        dataMap.map((e,index) => {
            if(e[optionShow].indexOf(val) != -1){
                showArr[index] = false
            }else{
                showArr[index] = true
            }
        })
        setShowListIsShow(showArr)
    }

    return (
        // <Form.Item name={name} noStyle rules={[{ required: true, message: '请选择游戏区服' }]}>
            <Select 
                maxTagTextLength={3} 
                dropdownStyle={{maxHeight: 400}} 
                maxTagCount={maxTagCount ? maxTagCount : 3} 
                value={checked} onClear={() => {return setChecked([])}} 
                allowClear mode='multiple' 
                style={{width:'100%'}} 
                onChange={onSelectChange}
                dropdownRender={menu => (
                    dataMap ? dataMap.length > 0 ?  <Row style={{height:'100%'}}>
                        <Col span={24} style={{height:'100%'}}>
                            <div style={{padding:10,height:110,borderBottom: "1px #f0f0f0 solid"}}>
                                <Input.Search
                                    placeholder="搜索"
                                    enterButton="查找"
                                    onSearch={search}
                                />
                                <Input.Search 
                                    placeholder="xxx~xxx" 
                                    onSearch={e => onCheckRangeChange(e,true)}
                                    enterButton="选择"
                                    style={{width:190,margin:5}}
                                    />
                                <Input.Search 
                                    style={{width:190,margin:5}}
                                    placeholder="xxx~xxx" 
                                    onSearch={e => onCheckRangeChange(e,false)}
                                    enterButton="取消选择"
                                />
                                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={isAll}>{'全选'}</Checkbox>
                            </div>
                            <Row style={{padding:5,maxHeight:290,width:'100%',overflow:'auto'}}>
                                <Col span={6}>
                                    <Menu defaultSelectedKeys={['0']} onSelect={e => {
                                        if(e.key == -1){
                                            setShowList(dataMap)
                                        }else{
                                            setShowList(dataMap.slice((0 + Number(e.key)*100),(100 + Number(e.key)*100)))
                                        }
                                    }}>
                                        <Menu.Item key={-1}>全部</Menu.Item>
                                        {
                                            dataMap.length/100 > 1 ? new Array(Math.ceil(dataMap.length/100)).fill(0).map((e,index) => <Menu.Item key={index} >{(1 + 100*index) + '~' + ((100 + 100*index)>dataMap.length ? dataMap.length : 100 + 100*index)}</Menu.Item>) : null
                                        }
                                    </Menu>
                                </Col>
                                <Col span={18}>
                                    <Checkbox.Group onChange={onChange} value={checked} >
                                        <Row style={{padding:5,height:'100',width:'100%',overflow:'auto'}}>
                                            {
                                                showList.map((e,index) =>  {
                                                    return ( <Col key={e[optionVal]} span={24/colNumber} hidden={showListIsShow[index]} >
                                                        <Checkbox value={e[optionVal]}>{e[optionShow]}</Checkbox>
                                                    </Col> )
                                                })
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row> : <Empty/> : <Empty/>
                    
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
        // </Form.Item>
    );
}
