/* eslint-disable @typescript-eslint/no-explicit-any */
import { convert_data } from '../data';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Edit_thuoc_tinh from './edit';
import { Dispatch_thuoc_tinh } from '../../../../API/Dispatch/slice_attribute';
import { Button, Popconfirm, Spin, Table, TableProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


const Table_cpnt = ({ data_props }: any) => {
    const { mutate, isLoading, isError } = Dispatch_thuoc_tinh('REMOVE');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const showModal = (id: string | number) => {
        const url_location: any = window.location;
        const url = new URL(url_location);
        url.searchParams.set('_id', id.toString());
        navigate(url.pathname + '?' + url.searchParams.toString());
        setIsModalOpen(true);
    };
    const dataSort = data_props?.filter(
        (value: any) =>
            value?._id && {
                key: value?._id,
                ...value
            }
    );
    if (isError) return <span>Error...</span>
    const columns: TableProps<any>['columns'] = [
        {
            title: ' ',
            key: '_id',
            render: (value: any) => {
                return (<> {
                    value?.symbol_thuoc_tinh ?
                        value?.the_loai_thuoc_tinh === 'ux_image' ?
                            <img width={60} height={60} src={value?.symbol_thuoc_tinh} /> :
                            <td><div style={{
                                backgroundColor: value?.symbol_thuoc_tinh
                            }} className={`w-6 h-6 rounded border`}></div></td> :
                        <div></div>
                }
                </>)
            },
        },
        {
            title: 'Tên thuộc tính',
            key: '_id',
            render: (value: any) => <span>{value?.ten_thuoc_tinh}</span>,
        },
        {
            title: 'Loại thuộc tính',
            key: 'category_attribute',
            render: (value: any) => {
                const attribute = convert_data.find(item => item.key === value?.the_loai_thuoc_tinh);
                return <span>{attribute ? attribute.name : value?.the_loai_thuoc_tinh}</span>
            },
        },
        {
            title: 'Thao tác',
            key: 'address',
            render: (value: any) => (
                <div className='flex items-center gap-x-2 mt-1 *:text-sm'>
                    <button className='text-sky-500 px-3 py-1.5 rounded bg-[#F1F5F9] hover:text-sky-700' onClick={() => showModal(value?._id)}>Sửa</button>
                    <Edit_thuoc_tinh props={{ isModalOpen, setIsModalOpen }} />
                    <Popconfirm
                        title="Warning"
                        description={`Xác nhận xóa thuộc tính ${value?.ten_thuoc_tinh}`}
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