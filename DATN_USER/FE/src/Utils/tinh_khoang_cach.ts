/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from 'axios'

// async function tinh_toa_do(vi_tri: any) {
//     const mapboxAccessToken = "pk.eyJ1IjoibmFkdWMiLCJhIjoiY200MDIydDZnMXo4dzJpcjBiaTBiamRmdiJ9.-xDuU81CG7JJDtlHK5lc7w"
//     try {
//         const response = await axios.get(
//             `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(vi_tri)}.json`,
//             {
//                 params: {
//                     access_token: mapboxAccessToken,
//                     limit: 1,
//                 },
//             }
//         );

//         if (response.data.features && response.data.features.length > 0) {
//             const [lng, lat] = response.data.features[0].geometry.coordinates; // Kinh độ và vĩ độ
//             return { lat, lng };
//         } else {
//             console.warn("Không tìm thấy tọa độ cho địa chỉ này.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Lỗi khi lấy tọa độ từ địa chỉ:", error);
//         return null;
//     }
// }

function toRad(degrees: any) {
    return degrees * (Math.PI / 180);
}


export function Tinh_tong_km(vi_tri_nguoi_dung: any) {
    if (typeof vi_tri_nguoi_dung === 'object') {
        const shopLocation = [105.7421, 21.0376]; // Kinh độ và vĩ độ của Shop
        const R = 6371; // Bán kính trái đất tính bằng km
        const vi_do_1 = toRad(shopLocation[1]); // Vĩ độ của điểm 1 chuyển sang radians
        const vi_do_2 = toRad(vi_tri_nguoi_dung?.coordinates?.lat); // Vĩ độ của điểm 2 chuyển sang radians
        const chenh_lech_vi_do = toRad(vi_tri_nguoi_dung?.coordinates?.lat - shopLocation[1]); // Sự chênh lệch vĩ độ
        const chenh_lech_kinh_do = toRad(vi_tri_nguoi_dung?.coordinates?.lng - shopLocation[0]); // Sự chênh lệch kinh độ
        // Công thức Haversine
        const a = Math.sin(chenh_lech_vi_do / 2) * Math.sin(chenh_lech_vi_do / 2) +
            Math.cos(vi_do_1) * Math.cos(vi_do_2) *
            Math.sin(chenh_lech_kinh_do / 2) * Math.sin(chenh_lech_kinh_do / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Tính khoảng cách
        return R * c; // Khoảng cách theo km
    } else {
        return null
    }
}