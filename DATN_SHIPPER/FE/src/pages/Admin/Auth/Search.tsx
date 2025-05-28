import { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { Search_Auth } from "../../../_lib/Auth/Auth";

const SearchComponent = ({ initialData, setData }: { initialData: any, setData: (data: any) => void }) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ value: string }[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const onSearch = async (value: string) => {
        if (!value) {
            setData(initialData);
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const data = await Search_Auth(value);
            setData(data);
            setOptions(data?.map((item: any) => ({ value: item.name })));
        } catch (error) {
            return error
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const newTimeoutId = setTimeout(() => {
            onSearch(value);
        }, 500); // Thời gian delay 500ms
        setTimeoutId(newTimeoutId);
    };
    const onChane = (value: any) => {
        if (!value) {
            setData(initialData);
            setOptions([]);
            return;
        }
    }
    return (
        <AutoComplete
            options={options}
            onSearch={handleSearch}
            onChange={onChane}
            style={{ width: '20%' }}
        >
            <Input.Search
                placeholder="Tìm kiếm tài khoản"
                enterButton
                loading={loading}
            />
        </AutoComplete>
    );
};

export default SearchComponent;
