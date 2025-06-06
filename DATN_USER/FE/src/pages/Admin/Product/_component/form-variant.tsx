/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { SelectShadcn, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../../../../components/ui_shadcn_customer/select';
import { Button, Form, Select, Spin } from 'antd';
import { Filed_form } from './filed_form';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import Filed_bien_the_dua_theo_thuoc_tinh from './bien-the-dua-theo-thuoc-tinh';
import useLocalStorage from '../../../../common/hooks/Storage/useStorage';
import { Lay_the_loai_thuoc_tinh } from '../../../../API/Dispatch/slice_attribute';

export default function Form_variant({ propsData }: any) {
    const [user] = useLocalStorage('user', '');
    const [state_variant, setState_variant] = useState<string>('');
    const [state_attribute, setStateCategory_attribute] = useState<string>('');
    const { data: data_v2, isLoading: loading } = Lay_the_loai_thuoc_tinh({
        id_account: user?.user?._id
    })
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }
    const initialAttributes = (
        [
            {
                color: '',
                symbol: '',
                size: [
                    {
                        name_size: '',
                        stock_attribute: 0,
                        price_attribute: 0,
                        // sale: 0
                    }
                ],
            }
        ]
    );
    return (
        <div>
            <div className='w-[40%] *:bg-white *:z-[10] *:rounded mb-4'>
                <SelectShadcn onValueChange={(value: any) => setState_variant(value)}>
                    <SelectTrigger className="!h-auto py-2 mt-1">
                        <SelectValue placeholder="Lựa chọn" />
                    </SelectTrigger>
                    <SelectContent className='bg-white z-[10]'>
                        <SelectGroup>
                            <SelectItem value="tao_bien_the_tu_thuoc_tinh">Tạo biến thể từ các thuộc tính</SelectItem>
                            <SelectItem value="them_moi_bien_the">Tạo mới biến thể biến thể</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </SelectShadcn>
            </div>
            {
                (state_variant.toString() === 'them_moi_bien_the') ?
                    <div className='flex flex-col text-gray-800 gap-y-2 mt-1'>
                        <Form.List
                            name="new_attributes"
                            initialValue={initialAttributes}
                        >
                            {(fields, { add, remove }) => {
                                return (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key}>
                                                <div>
                                                <label
                                                    htmlFor=""
                                                    className="text-[#1C2434] font-medium text-sm">
                                                    Thuộc tính :
                                                </label>
                                                <Filed_form
                                                    props={{
                                                        name_field: [name, "color"],
                                                        ruler_field: [
                                                            {
                                                                required: true,
                                                                message: "Vui lòng nhập màu sắc!"
                                                            }
                                                        ],
                                                        restField: restField
                                                    }}
                                                />
                                                </div>
                                                <div >
                                                <Form.List name={[name, "size"]} initialValue={[{}]}>
                                                    {(
                                                        sizeFields,
                                                        { add: addSize, remove: removeSize }
                                                    ) => (
                                                        <>
                                                        
                                                            {sizeFields.map(
                                                                ({
                                                                    key: sizeKey,
                                                                    name: sizeName,
                                                                    ...restSizeField
                                                                }) => (
                                                                    <div
                                                                        key={sizeKey}
                                                                        className="flex items-center gap-[13px] mb-2 -mt-2"
                                                                    >
                                                                   
                                                                        <div>
                                                                            <label className="text-[#1C2434] font-medium text-sm">
                                                                                Kích cỡ :
                                                                            </label>
                                                                            <Form.Item
                                                                                {...restSizeField}
                                                                                name={[sizeName, "name_size"]}
                                                                            >
                                                                                <Select className=" mt-2 h-[40px] max-w-[200px] text-[#1C2434] border-gray-600 !outline-none "
                                                                                    options={propsData?.sizes.map((size: any) => ({
                                                                                        label: size,
                                                                                        value: size
                                                                                    }))}
                                                                                />
                                                                                {/* <Input className=" mt-2 py-2 max-w-[200px] text-[#1C2434] border-gray-600 !outline-none " /> */}
                                                                            </Form.Item>
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[#1C2434] font-medium text-sm">
                                                                                Số lượng :
                                                                            </label>
                                                                            <Filed_form
                                                                                props={{
                                                                                    name_field: [
                                                                                        sizeName,
                                                                                        "stock_attribute"
                                                                                    ],
                                                                                    ruler_field: [
                                                                                        {
                                                                                            required: true,
                                                                                            message: "Số lượng là bắt buộc!"
                                                                                        },
                                                                                        {
                                                                                            type: "number",
                                                                                            min: 0,
                                                                                            message:
                                                                                                "Số lượng phải là số dương!",
                                                                                            transform(value: number) {
                                                                                                return Number(value);
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                    restField: restSizeField
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-sm font-medium">
                                                                                {" "}
                                                                                Giá :
                                                                            </label>
                                                                            <br />
                                                                            <Filed_form
                                                                                props={{
                                                                                    name_field: [
                                                                                        sizeName,
                                                                                        "price_attribute"
                                                                                    ],
                                                                                    ruler_field: [
                                                                                        {
                                                                                            required: true,
                                                                                            message:
                                                                                                "Giá sản phẩm bắt buộc nhập!"
                                                                                        },
                                                                                        {
                                                                                            type: "number",
                                                                                            min: 0,
                                                                                            message:
                                                                                                "Giá sản phẩm phải là số dương!",
                                                                                            transform(value: number) {
                                                                                                return Number(value);
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                    restField: restSizeField
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {/* <div>
                                                                            <label className="text-sm font-medium">
                                                                                {" "}
                                                                                Ưu đãi (%) :
                                                                            </label>
                                                                            <Filed_form
                                                                                props={{
                                                                                    name_field: [
                                                                                        sizeName,
                                                                                        "sale"
                                                                                    ],
                                                                                    ruler_field: [
                                                                                        {
                                                                                            required: true,
                                                                                            message:
                                                                                                "Ưu đãi tối thiểu bằng 0!"
                                                                                        },
                                                                                        {
                                                                                            type: "number",
                                                                                            min: 0,
                                                                                            max: 50,
                                                                                            message:
                                                                                                "Ưu đãi sản phẩm phải là số dương nhỏ hơn 50!",
                                                                                            transform(value: number) {
                                                                                                return Number(value);
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                    restField: restSizeField
                                                                                }}
                                                                            />
                                                                        </div> */}
                                                                        {
                                                                            sizeFields?.length > 1 &&
                                                                            <DeleteOutlined
                                                                                onClick={() => removeSize(sizeName)}
                                                                                style={{ fontSize: "20px" }}
                                                                            />
                                                                        }
                                                                    </div>
                                                                    
                                                                )
                                                            )}
                                                            <div className="flex flex-col items-start gap-4 mb-4">
                                                                <Button
                                                                    type="primary"
                                                                    onClick={() => addSize()}
                                                                    className="px-2 "
                                                                >
                                                                    Thêm kích thước
                                                                </Button>
                                                                {
                                                                    (fields?.length > 1) &&
                                                                    <Button
                                                                        onClick={() => remove(name)}
                                                                        className="px-2  bg-red-600 text-gray-100 hover:!text-gray-100 border-none hover:!bg-red-700 hover"
                                                                    >
                                                                        Xóa thuộc tính
                                                                    </Button>
                                                                }
                                                            </div>
                                                        </>
                                                        
                                                    )}
                                                </Form.List>
                                                </div>
                                            </div>
                                        ))}
                                        <div>
                                            <Button
                                                className="px-2 my-4"
                                                type="primary"
                                                onClick={() => add()}
                                            >
                                                Thêm thuộc tính
                                            </Button>
                                        </div>
                                    </>
                                );
                            }}
                        </Form.List>
                    </div>
                    :
                    // tạo biến thể từ thuộc tính
                    (state_variant.toString() === 'tao_bien_the_tu_thuoc_tinh') &&
                    <>
                        <SelectShadcn onValueChange={(value: any) => setStateCategory_attribute(value)}>
                            <SelectTrigger className="!h-auto py-2 w-auto rounded -mt-[54px] ml-[450px] ">
                                <SelectValue placeholder="Lựa chọn" />
                            </SelectTrigger>
                            <SelectContent className='bg-while z-[10]'>
                                <SelectGroup>
                                    {
                                        data_v2?.map((value: any) => (
                                            <SelectItem value={value?.category_attribute}>{value?.name_attribute}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </SelectShadcn>
                        
                        {
                            state_attribute &&
                            <Filed_bien_the_dua_theo_thuoc_tinh props={{
                                category_attribute: state_attribute,
                                sizes: propsData?.sizes
                            }} />
                        }
                        
                    </>
            }
        </div>
    )
}