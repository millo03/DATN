import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { Query_Orders } from "../../../common/hooks/Order/querry_Order";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

mapboxgl.accessToken = "pk.eyJ1IjoibmFkdWMiLCJhIjoiY200MDIydDZnMXo4dzJpcjBiaTBiamRmdiJ9.-xDuU81CG7JJDtlHK5lc7w";

const Mapbox = ({ id }: { id: any }) => {
    const { data, isLoading, isError } = Query_Orders(id);
    const [customerLocation, setCustomerLocation] = useState<[number, number] | null>(null);
    const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const shopLocation: [number, number] = [105.734704 ,21.053134]; // Tọa độ cửa hàng

    useEffect(() => {
        if (data && data.customerInfo && data.customerInfo.toa_do) {
            const { lat, lng } = data.customerInfo.toa_do;
            setCustomerLocation([lng, lat]);
        }
    }, [data]);

    useEffect(() => {
        if (customerLocation) {
            const map = new mapboxgl.Map({
                container: mapContainerRef.current!,
                style: "mapbox://styles/mapbox/streets-v11",
                center: shopLocation,
                zoom: 14,
            });
            new mapboxgl.Marker({ color: "blue" })
                .setLngLat(shopLocation)
                .setPopup(new mapboxgl.Popup().setHTML("<h3>Shop Seven</h3>"))
                .addTo(map);
            new mapboxgl.Marker({ color: "red" })
                .setLngLat(customerLocation)
                .setPopup(new mapboxgl.Popup().setHTML("<h3>Khách hàng</h3>"))
                .addTo(map);
            const fetchRoute = async () => {
                try {
                    const response = await axios.get(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${shopLocation.join(
                            ","
                        )};${customerLocation.join(",")}`,
                        {
                            params: {
                                geometries: "geojson",
                                access_token: mapboxgl.accessToken,
                            },
                        }
                    );

                    if (response.data.routes && response.data.routes.length > 0) {
                        const route = response.data.routes[0].geometry;
                        const duration = response.data.routes[0].duration;
                        map.addSource("route", {
                            type: "geojson",
                            data: {
                                type: "Feature",
                                geometry: route,
                                properties: {},
                            },
                        });
                        map.addLayer({
                            id: "route",
                            type: "line",
                            source: "route",
                            layout: {
                                "line-join": "round",
                                "line-cap": "round",
                            },
                            paint: {
                                "line-color": "#0074d9",
                                "line-width": 4,
                            },
                        });
                        const minutes = Math.floor(duration / 60);
                        const seconds = Math.floor(duration % 60);
                        setEstimatedTime(`${minutes} phút ${seconds} giây`);
                    }
                } catch (error) {
                    console.error("Error fetching route:", error);
                }
            };

            map.on("load", fetchRoute);
            return () => map.remove();
        }
    }, [customerLocation]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[200px]">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
        );
    }

    if (isError || !data) {
        return <div>Không thể tải thông tin đơn hàng.</div>;
    }

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
            {estimatedTime && (
                <div className="text-lg font-semibold mb-2">
                    Thời gian dự kiến: {estimatedTime}
                </div>
            )}
            <div ref={mapContainerRef} className="w-full h-full rounded-xl" />
        </div>
    );
};

export default Mapbox;
