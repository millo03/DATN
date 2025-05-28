import { Form, Input, InputNumber } from "antd";
import { IAttribute } from "../../../../common/interfaces/Product";
import TextArea from "antd/es/input/TextArea";



type FieldType = {
    name_product: string;
    price_product: number;
    description_product: string;
    category_id: string[];
    image_product: string;
    gallery_product: string[];
    stock_product: number;
    attributes: IAttribute[];
    featured_product: boolean;
    tag_product: string[];
};

export function Filed_form({ props }: any) {
    return (
        <Form.Item<FieldType>
            {...props?.restField}
            name={props?.name_field}
            rules={props?.ruler_field}
        >
            {
                props?.action ?
                    props?.action === 'textarea' ?
                        <TextArea
                            className=" mt-2 py-2 max-w-[200px] border-gray-600 !outline-none hover:bg-[#F5F7FD] "
                            rows={4}
                        /> :
                        <InputNumber className="mt-2 !py-0.5 max-w-[200px] border-gray-600 !outline-none hover:bg-[#F5F7FD] " /> :
                    <Input className={`mt-2 py-2 text-[#1C2434] border-gray-600 hover:bg-[#F5F7FD] active:bg-[#active:bg-[#F5F7FD]] !outline-none
                         ${Array?.isArray(props?.name_field) && 'max-w-[200px]'}`} />
            }
        </Form.Item>
    )
}
