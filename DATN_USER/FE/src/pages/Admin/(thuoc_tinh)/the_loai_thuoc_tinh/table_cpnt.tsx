/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
import { convert_data } from '../data';
import { Dispatch_the_loai_thuoc_tinh } from '../../../../API/Dispatch/slice_attribute';
import { Button, Popconfirm, Spin, Table, TableProps } from 'antd';
import { useState } from 'react';
import Modal_cpnt from '../_components/modal_cpnt';
import { LoadingOutlined } from '@ant-design/icons';


const Table_cpnt = ({ data_props }: any) => {
    const { mutate, isLoading, isError } = Dispatch_the_loai_thuoc_tinh('REMOVE');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const showModal = (id: string | number) => {
        const url_location: any = window.location;
        const url = new URL(url_location);
        url.searchParams.set('_id', id.toString());
        navigate(url.pathname + '?' + url.searchParams.toString());
        setIsModalOpen(true);
    };
    if (isError) return <span>Error...</span>
    const dataSort = data_props?.filter(
        (value: any) =>
            value?._id && {
                key: value?._id,
                ...value
            }
    );

    const columns: TableProps<any>['columns'] = [
        {
            title: 'Tên',
            key: '_id',
            render: (text) => {
                console.log(text?.name_attribute);
                return <Link className='text-gray-800' to={`/admin/products/attribute-catalog/${text?._id}`}>{text?.name_attribute}</Link>
            },
        },
        {
            title: 'Loại thuộc tính',
            key: 'category_attribute',
            render: (value) => {
                const attribute = convert_data.find(item => item.key === value?.category_attribute);
                console.log(value?.name_attribute);
                return <span>{attribute ? attribute.name : value?.category_attribute}</span>
            },
        },
        {
            title: 'Thao tác',
            key: 'address',
            render: (value) => (
                <div className='flex items-center gap-x-2 mt-1 *:text-sm'>
                    <button className='text-sky-500 px-3 py-1.5 rounded bg-[#F1F5F9] hover:text-sky-700' onClick={() => showModal(value?._id)}>Sửa</button>
                    <Modal_cpnt props={{ isModalOpen, setIsModalOpen }} />
                    <Popconfirm
                        title="Warning"
                        description={`Xác nhận xóa thể loại thuộc tính ${value?.name_attribute}`}
                        onConfirm={() => mutate(value?._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className='border-none bg-[#F1F5F9] hover:!bg-[#F1F5F9] hover:!text-red-700 font-medium' danger>Xóa</Button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    return <div>
        {
            isLoading && <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        }
        {dataSort?.length > 0 ? (
            <Table<any> columns={columns} dataSource={dataSort} pagination={false} />
        ) : (
            <span>Không có dữ liệu!</span>
        )}
    </div>
};

export default Table_cpnt;