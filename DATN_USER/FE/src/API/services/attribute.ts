/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUri = "http://localhost:2004/api/v1";

// the loai thuoc tinh
export async function tao_the_loai_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/the_loai_thuoc_tinh/tao_thuoc_tinh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_request)
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}
export async function lay_the_loai_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/the_loai_thuoc_tinh/lay_loai_thuoc_tinh/${data_request?.id_account}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            return res
        }
        const { data } = await res.json()
        return data
    } catch (error) {
        console.log(error || "Loi server!");
    }
}
export async function lay_1_the_loai_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/the_loai_thuoc_tinh/lay_1_loai_thuoc_tinh/${data_request?.id_account}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Custom-Data-Request': JSON.stringify(data_request)
            },
        });
        if (!res.ok) {
            return res
        }
        const { data } = await res.json();
        return data
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function xoa_the_loai_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/the_loai_thuoc_tinh/xoa_loai_thuoc_tinh/${data_request}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function sua_the_loai_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/the_loai_thuoc_tinh/sua_loai_thuoc_tinh/${data_request.id_loai_thuoc_tinh}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data_request)
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}


// thuoc tinh
export async function tao_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/thuoc_tinh/tao_thuoc_tinh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_request)
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function lay_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/thuoc_tinh/lay_thuoc_tinh/${data_request?.id_account}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Custome-data-request': JSON.stringify(data_request?.category_attribute)
            },
        });
        if (!res.ok) {
            return res
        }
        const { data } = await res.json();
        return data
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function lay_1_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/thuoc_tinh/lay_1_thuoc_tinh/${data_request?.id_account}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Custom-Data-Request': JSON.stringify(data_request)
            },
        });
        if (!res.ok) {
            return res
        }
        const { data } = await res.json();
        return data
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function sua_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/thuoc_tinh/sua_thuoc_tinh/${data_request?.id_account}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_request)
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}

export async function xoa_thuoc_tinh(data_request: any) {
    try {
        const res = await fetch(`${baseUri}/thuoc_tinh/xoa_thuoc_tinh/${data_request}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return res
    } catch (error) {
        console.log(error || "Loi server!");
    }
}
